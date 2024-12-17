# **Payment Card Form (React Component)**

A customizable React component for handling payment card details. This package was adapted from the Angular project [**ng-payment-card-form**](https://github.com/Asrih7/ng-payment-card-form) and ported to React with TypeScript.

---

## **Installation**

Install the package via npm:

```bash
npm install payment-card-form
```

---

## **CSS Import**

To style the form correctly, you need to import the provided CSS file into your project:

```tsx
import "payment-card-form/dist/styles.min.css";
```

---

## **Props**

The `PaymentCardForm` component accepts the following props:

### **CardValues Interface**

This interface describes the structure of the form data:

```ts
interface CardValues {
  cardName?: string;
  cardNumber?: string;
  cardCvv?: string;
  cardYear?: number;
  cardMonth?: string;
  cardType?: string;
}
```

### **CardFormProps Interface**

These are the props passed to the `PaymentCardForm`:

| **Prop**           | **Type**                     | **Required** | **Description**                                 |
| ------------------ | ---------------------------- | ------------ | ----------------------------------------------- |
| `onSubmit`         | `(data: CardValues) => void` | ✅           | Callback function triggered on form submission. |
| `defaultValues`    | `CardValues`                 | ❌           | Pre-fill form with default values.              |
| `resetAfterSubmit` | `boolean`                    | ❌           | Resets the form fields after submission.        |

---

## **Usage Example**

Here’s how you can use the `PaymentCardForm` component in your project:

```tsx
import PaymentCardForm, { type CardValues } from "payment-card-form";
import "payment-card-form/dist/styles.min.css";

function App() {
  const onSubmit = (data: CardValues) => {
    console.log("Submitted Card Data:", data);
  };

  return (
    <div>
      <h1>Payment Form</h1>
      <PaymentCardForm onSubmit={onSubmit} />
    </div>
  );
}

export default App;
```

---

## **Features**

- 📝 **Customizable Props**: Easily handle form submission and defaults.
- 🎨 **CSS Styles**: Predefined styles for a clean card form UI.
- ⚙️ **TypeScript Support**: Fully typed props and form values for safe development.

---

## **Credits**

This package is adapted from the original Angular project:  
[**ng-payment-card-form**](https://github.com/Asrih7/ng-payment-card-form)
