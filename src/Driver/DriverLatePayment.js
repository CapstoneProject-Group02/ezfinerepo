import React, { useState } from "react";
import axios from "axios";
import "./DriverLatePayment.css";
import { useLanguage } from "../TraslateBtn/LanguageContext";
import englishContent from "../Json/Driver Late Payment/DLPE.json";
import sinhalaContent from "../Json/Driver Late Payment/DLPS.json";
import tamilContent from "../Json/Driver Late Payment/DLPT.json";
import { Link } from "react-router-dom";
import HomeButton from "../homeButton";

const DriverLatePayment = () => {
  const { selectedLanguage } = useLanguage();
  let content;
  switch (selectedLanguage) {
    case "english":
      content = englishContent;
      break;
    case "sinhala":
      content = sinhalaContent;
      break;
    case "tamil":
      content = tamilContent;
      break;
    default:
      content = englishContent;
  }

  const [licenseNumber, setLicenseNumber] = useState("");
  const [fineAmount, setFineAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [totalFine, setTotalFine] = useState("");

  const handleGetFineDetails = () => {
    if (!licenseNumber) {
      setError(content.PleaseEnterLicenseNumber);
      return;
    }
    axios
      .get(
        `http://localhost:3004/getFineDetails?licenseNumber=${licenseNumber}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          setFineAmount(response.data[0].fine_amount);
          setDate(response.data[0].date);
          setError("");
        } else {
          setError(content.NoFineDetailsFound);
        }
      })
      .catch((error) => {
        setFineAmount("");
        setDate("");
        setError(content.FailedToFetchFineDetails);
      });
  };

  const calculateTotalFine = () => {
    if (!date || !fineAmount) {
      setError(content.PleaseFetchFineDetailsFirst);
      return;
    }

    const currentDate = new Date();
    const offenceDate = new Date(date);
    const daysLate = Math.ceil(
      (currentDate - offenceDate) / (1000 * 60 * 60 * 24)
    );

    if (daysLate <= 7) {
      setTotalFine(fineAmount);
    } else {
      const additionalFine = 200 * (daysLate - 7);
      setTotalFine(+fineAmount + additionalFine);
    }
  };

  return (
    <div className="bglatepayment">
      <div className="overlaylatepayment">
        <h1>
          LATE PAYMENT <span style={{ color: "#E4A80E" }}>DETAILS</span>
        </h1>
        <div className="latepaymentinterface">
          <p>
            <b>{content.AdditionalCharge}</b>
          </p>
          <p>
            <b>{content.ChargePerDay}</b>
          </p>
          <input
            type="text"
            placeholder={content.EnterLicenseNumber}
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />

          <button onClick={handleGetFineDetails}>
            {content.GetFineDetails}
          </button>
          {fineAmount && date && (
            <div>
              <p>
                {content.FineAmount}: {fineAmount}
              </p>
              <p>
                {content.Date}: {date}
              </p>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          <br />
          <br />
          <button onClick={calculateTotalFine}>
            {content.CalculateTotalFine}
          </button>
          {totalFine && (
            <p>
              {content.TotalFineAmount}: {totalFine}
            </p>
          )}
          <br />
          <br />
          <Link to="/payment">
            <button className="button1">PayHere</button>
          </Link>
        </div>
      </div>
      <HomeButton></HomeButton>
    </div>
  );
};

export default DriverLatePayment;
