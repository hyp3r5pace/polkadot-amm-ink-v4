#![cfg_attr(not(feature = "std"), no_std, no_main)]

const PRECISION: u128 = 1_000_000; // Precision of 6 digits

#[ink::contract]
mod amm {
    use ink::storage::{traits::StorageKey, Mapping};

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Zero Liquidity
        ZeroLiquidity,
        /// Amount cannot be zero!
        ZeroAmount,
        /// Insufficient amount
        InsufficientAmount,
        /// Equivalent value of tokens not provided
        NonEquivalentValue,
        /// Asset value less than threshold for contribution!
        ThresholdNotReached,
        /// Share should be less than totalShare
        InvalidShare,
        /// Insufficient pool balance
        InsufficientLiquidity,
        /// Slippage tolerance exceeded
        SlippageExceeded,
    }

    #[derive(Default)]
    #[ink(storage)]
    pub struct Amm {
        total_shares: Balance, // Stores the total amount of share issued for the pool
        total_token1: Balance, // Stores the amount of Token1 locked in the pool
        total_token2: Balance, // Stores the amount of Token2 locked in the pool
        shares: Mapping<AccountId, Balance>, // Stores the share holding of each provider
        token1_balance: Mapping<AccountId, Balance>, // Stores the token1 balance of each user
        token2_balance: Mapping<AccountId, Balance>, // Stores the token2 balance of each user
        fees: Balance,        // Percent of trading fees charged on trade
    }

    #[ink(impl)]
    impl Amm {
        // Ensures that the qty is non-zero and the user has enough balance
        fn valid_amount_check<Key: StorageKey>(
            &self,
            balance: &Mapping<AccountId, Balance, Key>,
            qty: Balance,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            let my_balance = balance.get(&caller).unwrap_or(0);

            match qty {
                0 => Err(Error::ZeroAmount),
                _ if qty > my_balance => Err(Error::InsufficientAmount),
                _ => Ok(()),
            }
        }

        // Returns the liquidity constant of the pool
        fn get_k(&self) -> Balance {
            self.total_token1 * self.total_token2
        }

        // Used to restrict withdraw & swap feature till liquidity is added to the pool
        fn active_pool(&self) -> Result<(), Error> {
            match self.get_k() {
                0 => Err(Error::ZeroLiquidity),
                _ => Ok(()),
            }
        }
    }

    impl Amm {
        /// Constructs a new AMM instance
        /// @param fees: valid interval -> [0,1000)
        #[ink(constructor)]
        pub fn new(fees: Balance) -> Self {
            // Sets fees to zero if not in valid range
            Self {
                fees: if fees >= 1000 { 0 } else { fees },
                ..Default::default()
            }
        }

        /// Sends free token(s) to the invoker
        #[ink(message)]
        pub fn faucet(&mut self, amount_token1: Balance, amount_token2: Balance) {
            let caller = self.env().caller();
            let token1 = self.token1_balance.get(&caller).unwrap_or(0);
            let token2 = self.token2_balance.get(&caller).unwrap_or(0);

            self.token1_balance.insert(caller, &(token1 + amount_token1));
            self.token2_balance.insert(caller, &(token2 + amount_token2));
        }

        /// Returns the balance of the user
        #[ink(message)]
        pub fn get_my_holdings(&self) -> (Balance, Balance, Balance) {
            let caller = self.env().caller();
            let token1 = self.token1_balance.get(&caller).unwrap_or(0);
            let token2 = self.token2_balance.get(&caller).unwrap_or(0);
            let my_shares = self.shares.get(&caller).unwrap_or(0);
            (token1, token2, my_shares)
        }

        /// Returns the amount of tokens locked in the pool,total shares issued & trading fee param
        #[ink(message)]
        pub fn get_pool_details(&self) -> (Balance, Balance, Balance, Balance) {
            (
                self.total_token1,
                self.total_token2,
                self.total_shares,
                self.fees,
            )
        }

        /// Returns amount of Token1 required when providing liquidity with amount_token2 quantity of Token2
        #[ink(message)]
        pub fn get_equivalent_token1_estimate(
            &self,
            amount_token2: Balance,
        ) -> Result<Balance, Error> {
            self.active_pool()?;
            Ok(self.total_token1 * amount_token2 / self.total_token2)
        }

        /// Returns amount of Token2 required when providing liquidity with amount_token1 quantity of Token1
        #[ink(message)]
        pub fn get_equivalent_token2_estimate(
            &self,
            amount_token1: Balance,
        ) -> Result<Balance, Error> {
            self.active_pool()?;
            Ok(self.total_token2 * amount_token1 / self.total_token1)
        }

        /// Adding new liquidity in the pool
        /// Returns the amount of share issued for locking given assets
        #[ink(message)]
        pub fn provide(
            &mut self,
            amount_token1: Balance,
            amount_token2: Balance,
        ) -> Result<Balance, Error> {
            self.valid_amount_check(&self.token1_balance, amount_token1)?;
            self.valid_amount_check(&self.token2_balance, amount_token2)?;

            let share;
            if self.total_shares == 0 {
                // Genesis liquidity is issued 100 Shares
                share = 100 * super::PRECISION;
            } else {
                let share1 = self.total_shares * amount_token1 / self.total_token1;
                let share2 = self.total_shares * amount_token2 / self.total_token2;

                if share1 != share2 {
                    return Err(Error::NonEquivalentValue);
                }
                share = share1;
            }

            if share == 0 {
                return Err(Error::ThresholdNotReached);
            }

            let caller = self.env().caller();
            let token1 = self.token1_balance.get(&caller).unwrap();
            let token2 = self.token2_balance.get(&caller).unwrap();
            self.token1_balance.insert(caller, &(token1 - amount_token1));
            self.token2_balance.insert(caller, &(token2 - amount_token2));

            self.total_token1 += amount_token1;
            self.total_token2 += amount_token2;
            self.total_shares += share;

            let shares = self.shares.get(caller).unwrap_or(0);
            self.shares.insert(&caller, &(shares + share));

            Ok(share)
        }

        /// Returns the estimate of Token1 & Token2 that will be released on burning given share
        #[ink(message)]
        pub fn get_withdraw_estimate(&self, share: Balance) -> Result<(Balance, Balance), Error> {
            self.active_pool()?;
            if share > self.total_shares {
                return Err(Error::InvalidShare);
            }

            let amount_token1 = share * self.total_token1 / self.total_shares;
            let amount_token2 = share * self.total_token2 / self.total_shares;
            Ok((amount_token1, amount_token2))
        }

        /// Removes liquidity from the pool and releases corresponding Token1 & Token2 to the withdrawer
        #[ink(message)]
        pub fn withdraw(&mut self, share: Balance) -> Result<(Balance, Balance), Error> {
            let caller = self.env().caller();
            self.valid_amount_check(&self.shares, share)?;

            let (amount_token1, amount_token2) = self.get_withdraw_estimate(share)?;

            let shares = self.shares.get(caller).expect("Infallible");
            self.shares.insert(&caller, &(shares - share));

            self.total_shares -= share;

            self.total_token1 -= amount_token1;
            self.total_token2 -= amount_token2;

            let balance1 = self.token1_balance.get(caller).unwrap_or(0);
            self.token1_balance
                .insert(&caller, &(balance1 + amount_token1));

            let balance2 = self.token2_balance.get(caller).unwrap_or(0);
            self.token2_balance
                .insert(&caller, &(balance2 + amount_token2));

            Ok((amount_token1, amount_token2))
        }

        /// Returns the amount of Token2 that the user will get when swapping a given amount of Token1 for Token2
        #[ink(message)]
        pub fn get_swap_token1_estimate_given_token1(
            &self,
            amount_token1: Balance,
        ) -> Result<Balance, Error> {
            self.active_pool()?;
            let amount_token1 = (1000 - self.fees) * amount_token1 / 1000; // Adjusting the fees charged

            let token1_after = self.total_token1 + amount_token1;
            let token2_after = self.get_k() / token1_after;
            let mut amount_token2 = self.total_token2 - token2_after;

            // To ensure that Token2's pool is not completely depleted leading to inf:0 ratio
            if amount_token2 == self.total_token2 {
                amount_token2 -= 1;
            }
            Ok(amount_token2)
        }

        /// Returns the amount of Token1 that the user should swap to get amount_token2 in return
        #[ink(message)]
        pub fn get_swap_token1_estimate_given_token2(
            &self,
            amount_token2: Balance,
        ) -> Result<Balance, Error> {
            self.active_pool()?;
            if amount_token2 >= self.total_token2 {
                return Err(Error::InsufficientLiquidity);
            }

            let token2_after = self.total_token2 - amount_token2;
            let token1_after = self.get_k() / token2_after;
            let amount_token1 = (token1_after - self.total_token1) * 1000 / (1000 - self.fees);
            Ok(amount_token1)
        }

        /// Swaps given amount of Token1 to Token2 using algorithmic price determination
        /// Swap fails if Token2 amount is less than min_token2
        #[ink(message)]
        pub fn swap_token1_given_token1(
            &mut self,
            amount_token1: Balance,
            min_token2: Balance,
        ) -> Result<Balance, Error> {
            let caller = self.env().caller();
            self.valid_amount_check(&self.token1_balance, amount_token1)?;

            let amount_token2 = self.get_swap_token1_estimate_given_token1(amount_token1)?;
            if amount_token2 < min_token2 {
                return Err(Error::SlippageExceeded);
            }

            let balance1 = self.token1_balance.get(caller).expect("Infallible");
            self.token1_balance
                .insert(&caller, &(balance1 - amount_token1));

            self.total_token1 += amount_token1;
            self.total_token2 -= amount_token2;

            let balance2 = self.token2_balance.get(caller).unwrap_or(0);
            self.token2_balance
                .insert(&caller, &(balance2 + amount_token2));

            Ok(amount_token2)
        }

        /// Swaps given amount of Token1 to Token2 using algorithmic price determination
        /// Swap fails if amount of Token1 required to obtain amount_token2 exceeds max_token1
        #[ink(message)]
        pub fn swap_token1_given_token2(
            &mut self,
            amount_token2: Balance,
            max_token1: Balance,
        ) -> Result<Balance, Error> {
            let caller = self.env().caller();
            let amount_token1 = self.get_swap_token1_estimate_given_token2(amount_token2)?;
            if amount_token1 > max_token1 {
                return Err(Error::SlippageExceeded);
            }
            self.valid_amount_check(&self.token1_balance, amount_token1)?;

            let balance1 = self.token1_balance.get(caller).expect("Infallible");
            self.token1_balance
                .insert(&caller, &(balance1 - amount_token1));

            self.total_token1 += amount_token1;
            self.total_token2 -= amount_token2;

            let balance2 = self.token2_balance.get(caller).unwrap_or(0);
            self.token2_balance
                .insert(&caller, &(balance2 + amount_token2));

            Ok(amount_token1)
        }

        /// Returns the amount of Token2 that the user will get when swapping a given amount of Token1 for Token2
        #[ink(message)]
        pub fn get_swap_token2_estimate_given_token2(
            &self,
            amount_token2: Balance,
        ) -> Result<Balance, Error> {
            self.active_pool()?;
            let amount_token2 = (1000 - self.fees) * amount_token2 / 1000; // Adjusting the fees charged

            let token2_after = self.total_token2 + amount_token2;
            let token1_after = self.get_k() / token2_after;
            let mut amount_token1 = self.total_token1 - token1_after;

            // To ensure that Token1's pool is not completely depleted leading to inf:0 ratio
            if amount_token1 == self.total_token1 {
                amount_token1 -= 1;
            }
            Ok(amount_token1)
        }

        /// Returns the amount of Token2 that the user should swap to get amount_token1 in return
        #[ink(message)]
        pub fn get_swap_token2_estimate_given_token1(
            &self,
            amount_token1: Balance,
        ) -> Result<Balance, Error> {
            self.active_pool()?;
            if amount_token1 >= self.total_token1 {
                return Err(Error::InsufficientLiquidity);
            }

            let token1_after = self.total_token1 - amount_token1;
            let token2_after = self.get_k() / token1_after;
            let amount_token2 = (token2_after - self.total_token2) * 1000 / (1000 - self.fees);
            Ok(amount_token2)
        }

        /// Swaps given amount of Token2 to Token1 using algorithmic price determination
        /// Swap fails if Token1 amount is less than min_token1
        #[ink(message)]
        pub fn swap_token2_given_token2(
            &mut self,
            amount_token2: Balance,
            min_token1: Balance,
        ) -> Result<Balance, Error> {
            let caller = self.env().caller();
            self.valid_amount_check(&self.token2_balance, amount_token2)?;

            let amount_token1 = self.get_swap_token2_estimate_given_token2(amount_token2)?;
            if amount_token1 < min_token1 {
                return Err(Error::SlippageExceeded);
            }

            let balance2 = self.token2_balance.get(caller).expect("Infallible");
            self.token2_balance
                .insert(&caller, &(balance2 - amount_token2));

            self.total_token2 += amount_token2;
            self.total_token1 -= amount_token1;

            let balance1 = self.token1_balance.get(caller).unwrap_or(0);
            self.token1_balance
                .insert(&caller, &(balance1 - amount_token1));

            Ok(amount_token1)
        }

        /// Swaps given amount of Token2 to Token1 using algorithmic price determination
        /// Swap fails if amount of Token2 required to obtain amount_token1 exceeds max_token2
        #[ink(message)]
        pub fn swap_token2_given_token1(
            &mut self,
            amount_token1: Balance,
            max_token2: Balance,
        ) -> Result<Balance, Error> {
            let caller = self.env().caller();

            let amount_token2 = self.get_swap_token2_estimate_given_token1(amount_token1)?;
            if amount_token2 > max_token2 {
                return Err(Error::SlippageExceeded);
            }
            self.valid_amount_check(&self.token2_balance, amount_token2)?;

            let balance2 = self.token2_balance.get(caller).expect("Infallible");
            self.token2_balance
                .insert(&caller, &(balance2 - amount_token2));

            self.total_token2 += amount_token2;
            self.total_token1 -= amount_token1;

            let balance1 = self.token1_balance.get(caller).unwrap_or(0);
            self.token1_balance
                .insert(&caller, &(balance1 - amount_token1));

            Ok(amount_token2)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let contract = Amm::new(0);
            assert_eq!(contract.get_my_holdings(), (0, 0, 0));
            assert_eq!(contract.get_pool_details(), (0, 0, 0, 0));
        }

        #[ink::test]
        fn faucet_works() {
            let mut contract = Amm::new(0);
            contract.faucet(100, 200);
            assert_eq!(contract.get_my_holdings(), (100, 200, 0));
        }

        #[ink::test]
        fn zero_liquidity_test() {
            let contract = Amm::new(0);
            let res = contract.get_equivalent_token1_estimate(5);
            assert_eq!(res, Err(Error::ZeroLiquidity));
        }

        #[ink::test]
        fn provide_works() {
            let mut contract = Amm::new(0);
            contract.faucet(100, 200);
            let share = contract.provide(10, 20).unwrap();
            assert_eq!(share, 100_000_000);
            assert_eq!(contract.get_pool_details(), (10, 20, share, 0));
            assert_eq!(contract.get_my_holdings(), (90, 180, share));
        }

        #[ink::test]
        fn withdraw_works() {
            let mut contract = Amm::new(0);
            contract.faucet(100, 200);
            let share = contract.provide(10, 20).unwrap();
            assert_eq!(contract.withdraw(share / 5).unwrap(), (2, 4));
            assert_eq!(contract.get_my_holdings(), (92, 184, 4 * share / 5));
            assert_eq!(contract.get_pool_details(), (8, 16, 4 * share / 5, 0));
        }

        #[ink::test]
        fn swap_works() {
            let mut contract = Amm::new(0);
            contract.faucet(100, 200);
            let share = contract.provide(50, 100).unwrap();
            let amount_token2 = contract.swap_token1_given_token1(50, 50).unwrap();
            assert_eq!(amount_token2, 50);
            assert_eq!(contract.get_my_holdings(), (0, 150, share));
            assert_eq!(contract.get_pool_details(), (100, 50, share, 0));
        }

        #[ink::test]
        fn slippage_works() {
            let mut contract = Amm::new(0);
            contract.faucet(100, 200);
            let share = contract.provide(50, 100).unwrap();
            let amount_token2 = contract.swap_token1_given_token1(50, 51);
            assert_eq!(amount_token2, Err(Error::SlippageExceeded));
            assert_eq!(contract.get_my_holdings(), (50, 100, share));
            assert_eq!(contract.get_pool_details(), (50, 100, share, 0));
        }

        #[ink::test]
        fn trading_fees_works() {
            let mut contract = Amm::new(100);
            contract.faucet(100, 200);
            contract.provide(50, 100).unwrap();
            let amount_token2 = contract.get_swap_token1_estimate_given_token1(50).unwrap();
            assert_eq!(amount_token2, 48);
        }
    }
}
