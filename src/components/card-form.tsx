import React, { useEffect, useState } from "react";
import "./card-form.scss";

export interface CardValues {
  cardName?: string;
  cardNumber?: string;
  cardCvv?: string;
  cardYear?: number;
  cardMonth?: string;
  cardType?: string;
}

interface CardFormProps {
  onSubmit: (data: CardValues) => void;
  defaultValues?: CardValues;
  resetAfterSubmit?: boolean;
}

const CardForm = ({
  onSubmit,
  defaultValues,
  resetAfterSubmit = true,
}: CardFormProps) => {
  const initialValues = () => {
    const obj = defaultValues || {};
    return {
      cardName: obj.cardName || "",
      cardNumber: obj.cardNumber || getMaskForCardType(""),
      cardCvv: obj.cardCvv || "",
      cardYear: obj.cardYear || 0,
      cardMonth: obj.cardMonth || "",
      cardType: obj.cardType || "",
    };
  };

  const [data, setData] = useState<CardValues>(initialValues);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [focusElementStyle, setFocusElementStyle] = useState<
    | {
        border: string;
      }
    | undefined
  >(undefined);
  const [currentCardBackground, setCurrentCardBackground] = useState("");

  const minCardYear = new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  const years: number[] = Array.from({ length: 12 }, (_, i) => minCardYear + i);

  const minCardMonth = data.cardYear === currentYear ? currentMonth : 1;

  useEffect(() => {
    updateCardBackground();
    updateCardType();
  }, []);

  const updateData = (key: keyof CardValues, value: string | number) => {
    setData((prevData) => {
      const newData = {
        ...prevData,
        [key]: key === "cardYear" ? parseInt(`${value}`) : value,
      };
      return newData;
    });
  };

  const updateCardType = () => {
    const cardType = getCardType();
    updateData("cardType", cardType);
  };

  const getCardType = () => {
    if (!data.cardNumber) {
      return "";
    }
    const number = data.cardNumber.replace(/\D/g, "");
    const cardPatterns = {
      amex: /^3[47][0-9]{13}$/,
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      dinersclub: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}$/,
      jcb: /^35(2[89]|[3-8])/,
      unionpay: /^62/,
      troy: /^9792/,
    };

    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(number)) {
        return type;
      }
    }
    return "";
  };

  const formatCardNumber = (cardNumber: string) => {
    if (cardNumber === "#### #### #### ####") {
      return; // Do not format if placeholder or empty
    }

    let value = cardNumber.replace(/\D/g, "");
    const cardType = getCardType();
    let formattedValue = "";
    let mask = getMaskForCardType(cardType);
    let maxLength = mask.replace(/[^#]/g, "").length;

    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }

    let maskIndex = 0;
    for (let i = 0; i < value.length && maskIndex < mask.length; i++) {
      if (mask[maskIndex] === "#") {
        formattedValue += value[i];
      } else {
        formattedValue += mask[maskIndex];
        i--;
      }
      maskIndex++;
    }

    updateData("cardNumber", formattedValue);
    updateCardType();
  };

  function getMaskForCardType(type: string) {
    switch (type) {
      case "amex":
        return "#### ###### #####";
      case "dinersclub":
        return "#### ###### ####";
      default:
        return "#### #### #### ####";
    }
  }

  const focusInput = () => {
    if (data.cardNumber === "#### #### #### ####") {
      updateData("cardNumber", ""); // Clear placeholder on focus
    }
    setIsInputFocused(true);
    updateFocusElementStyle();
  };

  const blurInput = () => {
    if (data.cardNumber === "") {
      updateData("cardNumber", "#### #### #### ####"); // Restore placeholder if no input
    }
    setIsInputFocused(false);
    updateFocusElementStyle();
  };

  const updateFocusElementStyle = () => {
    const style = isInputFocused ? { border: "2px solid blue" } : undefined;
    setFocusElementStyle(style);
  };

  const flipCard = (isFlipped: boolean) => {
    setIsCardFlipped(isFlipped);
  };

  const getFormattedCardName = (): string[] => {
    if (!data.cardName) return [];
    return data.cardName.replace(/\s\s+/g, " ").split("");
  };

  const updateCardBackground = () => {
    const baseUrl =
      "https://raw.githubusercontent.com/sessionkiller/payment-card-form/main/src/assets/images/";

    const random = Math.floor(Math.random() * 25) + 1;
    const background = `${baseUrl}${random}.jpeg`;
    setCurrentCardBackground(background);
  };

  const getCardTypeImageUrl = () => {
    const baseUrl =
      "https://raw.githubusercontent.com/sessionkiller/payment-card-form/main/src/assets/images/";
    return data.cardType
      ? `${baseUrl}${data.cardType}.png`
      : `${baseUrl}visa.png`;
  };

  const submitData = () => {
    onSubmit(data);
    if (resetAfterSubmit) {
      setData(initialValues);
    }
  };

  return (
    <div className="card-form">
      <div className="card-list">
        <div className={`card-item ${isCardFlipped && "-active"}`}>
          <div className="card-item__side -front">
            <div
              className={`card-item__focus ${isInputFocused && "-active"}`}
              style={focusElementStyle}
            ></div>
            <div className="card-item__cover">
              <img
                src={currentCardBackground}
                alt="Background"
                className="card-item__bg"
              />
            </div>

            <div className="card-item__wrapper">
              <div className="card-item__top">
                <img
                  src="https://raw.githubusercontent.com/sessionkiller/payment-card-form/main/src/assets/images/chip.png"
                  className="card-item__chip"
                />
                <div className="card-item__type">
                  <img
                    src={getCardTypeImageUrl()}
                    className="card-item__typeImg"
                  />
                </div>
              </div>

              <div className="card-item__number">
                {data.cardNumber
                  ? data.cardNumber.split("").map((n, index) => (
                      <div key={index} className="card-item__numberItem">
                        {n === "#" ? <>&#35;</> : n}
                      </div>
                    ))
                  : null}
              </div>

              <div className="card-item__content">
                <label htmlFor="cardName" className="card-item__info">
                  <div className="card-item__holder">Card Holder</div>
                  <div className="card-item__name">
                    {data.cardName
                      ? getFormattedCardName().map((n, index) => (
                          <span key={index} className="card-item__nameItem">
                            {n}
                          </span>
                        ))
                      : "Full Name"}
                  </div>
                </label>
                <div className="card-item__date">
                  <label htmlFor="cardMonth" className="card-item__dateTitle">
                    Expires
                  </label>
                  <label htmlFor="cardMonth" className="card-item__dateItem">
                    <span>{data.cardMonth || "MM"}</span>
                  </label>
                  /
                  <label htmlFor="cardYear" className="card-item__dateItem">
                    <span>
                      {data.cardYear ? data.cardYear.toString().slice(2) : "YY"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card-item__side -back">
            <div className="card-item__cover">
              <img src={currentCardBackground} className="card-item__bg" />
            </div>
            <div className="card-item__band"></div>
            <div className="card-item__cvv">
              <div className="card-item__cvvTitle">CVV</div>
              <div className="card-item__cvvBand">
                {data.cardCvv
                  ? data.cardCvv
                      .split("")
                      .map((_, index) => <span key={index}>*</span>)
                  : null}
              </div>
              <div className="card-item__type">
                <img
                  src={getCardTypeImageUrl()}
                  className="card-item__typeImg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-form__inner">
        <div className="card-input">
          <label htmlFor="cardName" className="card-input__label">
            Card Name
          </label>
          <input
            type="text"
            id="cardName"
            className="card-input__input"
            value={data.cardName}
            onChange={(e) => updateData("cardName", e.target.value)}
            onFocus={focusInput}
            onBlur={blurInput}
            autoComplete="off"
          />
        </div>

        <div className="card-input">
          <label htmlFor="cardNumber" className="card-input__label">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            className="card-input__input"
            value={data.cardNumber}
            onChange={(e) => formatCardNumber(e.target.value)}
            onFocus={focusInput}
            onBlur={blurInput}
            maxLength={19}
            autoComplete="off"
          />
        </div>

        <div className="card-form__row">
          <div className="card-form__col">
            <div className="card-form__group">
              <label htmlFor="cardMonth" className="card-input__label">
                Expiration Date
              </label>
              <select
                className="card-input__input -select"
                id="cardMonth"
                value={data.cardMonth}
                onChange={(e) => updateData("cardMonth", e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              >
                <option value="" disabled>
                  Month
                </option>
                {months.map((month) => (
                  <option
                    key={month}
                    value={month < 10 ? "0" + month : month}
                    disabled={month < minCardMonth}
                  >
                    {month < 10 ? "0" + month : month}
                  </option>
                ))}
              </select>
              <select
                className="card-input__input -select"
                id="cardYear"
                value={data.cardYear}
                onChange={(e) => updateData("cardYear", e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              >
                <option value="0" disabled>
                  Year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card-form__col -cvv">
            <div className="card-input">
              <label htmlFor="cardCvv" className="card-input__label">
                CVV
              </label>
              <input
                type="text"
                id="cardCvv"
                className="card-input__input"
                value={data.cardCvv}
                onChange={(e) => updateData("cardCvv", e.target.value)}
                onFocus={() => flipCard(true)}
                onBlur={() => flipCard(false)}
                maxLength={4}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <button className="card-form__button" onClick={submitData}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default CardForm;
