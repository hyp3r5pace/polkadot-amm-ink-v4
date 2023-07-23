import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";
import BN from "bn.js";

export default function FaucetComponent(props) {
  const [amountOfKar, setAmountOfKar] = useState(0);
  const [amountOfKothi, setAmountOfKothi] = useState(0);

  const onChangeAmountOfKothi = (e) => {
    setAmountOfKothi(e.target.value);
  };

  const onChangeAmountOfKar = (e) => {
    setAmountOfKar(e.target.value);
  };

  const getGasAndValue = () => {
    if(props.api == null) {throw new Error("Failed to create gaslimit")}
    const gasLimit = props.api.registry.createType("WeightV2", {
        refTime: new BN("100000000000"),
        proofSize: new BN("100000000000"),
    });
    const value = 0;
    return { gasLimit, value };
  };

  // Funds the account with given amount of Tokens
  async function onClickFund() {
    if (props.contract === null || !props?.activeAccount?.address) {
      alert("Connect your wallet");
      return;
    }
    if (["", "."].includes(amountOfKar) || ["", "."].includes(amountOfKothi)) {
      alert("Amount should be a valid number");
      return;
    }
    try {
      await props.contract.tx
        .faucet(
          getGasAndValue(),
          amountOfKar * PRECISION,
          amountOfKothi * PRECISION
        )
        .signAndSend(
          props.activeAccount.address,
          { signer: props.signer },
          async (res) => {
            if (res.status.isFinalized) {
              await props.getHoldings();
              alert("Tx successful");
            }
          }
        );
      alert("Tx submitted");
      setAmountOfKar(0);
      setAmountOfKothi(0);
    } catch (err) {
      alert(err);
      console.log(err);
    }
  }

  return (
    <div className="tabBody">
      <div className="tabHeader">Faucet</div>
      <BoxTemplate
        leftHeader={"Amount of KAR"}
        right={<div className="coinWrapper">KAR</div>}
        value={amountOfKar}
        onChange={(e) => onChangeAmountOfKar(e)}
      />
      <BoxTemplate
        leftHeader={"Amount of KOTHI"}
        right={<div className="coinWrapper">KOTHI</div>}
        value={amountOfKothi}
        onChange={(e) => onChangeAmountOfKothi(e)}
      />
      <div className="bottomDiv">
        <div className="btn" onClick={() => onClickFund()}>
          Fund
        </div>
      </div>
    </div>
  );
}
