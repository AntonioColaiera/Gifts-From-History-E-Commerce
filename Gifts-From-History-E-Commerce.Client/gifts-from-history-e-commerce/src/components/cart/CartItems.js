import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  removeItem,
  updateQuantity,
} from "../redux/actions/cartAction";
import "./CartItems.css";
import Login from "../authentication/Login.js";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CheckoutItems from "./CheckoutItems.js";

export default function CartItems() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const checkoutCode = uuidv4();

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));

    if (savedCartItems) {
      dispatch({ type: "LOAD_CART_ITEMS", payload: savedCartItems });
    }
    localStorage.setItem("checkoutCode", checkoutCode);
  }, [dispatch, checkoutCode]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Funzione per gestire l'aggiunta di un elemento al carrello
  const handleAddItem = (item) => {
    dispatch(addItem(item)); // Dispatch dell'azione per aggiungere un elemento al carrello
  };

  // Funzione per gestire la rimozione di un elemento dal carrello
  const handleRemoveItem = (item) => {
    dispatch(removeItem(item)); // Dispatch dell'azione per rimuovere un elemento dal carrello
  };

  const handleIncrementQuantity = (item) => {
    dispatch(updateQuantity(item, item.quantity + 1)); // Aggiorna la quantità dell'elemento nel carrello
  };

  // Funzione per gestire la riduzione della quantità di un elemento nel carrello
  const handleDecrementQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity(item, item.quantity - 1)); // Aggiorna la quantità dell'elemento nel carrello
      console.log("Dopo la riduzione della quantità di un elemento");
    } else {
      console.log("La quantità minima è 1");
    }
  };

  const calculateTotalPrice = () => {
    if (!Array.isArray(cartItems)) {
      return 0;
    }

    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  const saveCartToLocalStorage = () => {
    if (Array.isArray(cartItems)) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log(
        "Salvataggio elementi del carrello in localStorage:",
        cartItems
      );
    } else {
      console.error("cartItems is not an array:", cartItems);
    }
  };

  return (
    <div>
      {cartItems.length === 0 ? ( // Condizione: se il carrello è vuoto
        <div>
          <img src='/assets/cartEmpty.jpg' alt='The cart is empty' />
          <p>The cart is empty</p> {/* Messaggio se il carrello è vuoto */}
        </div>
      ) : (
        // Se ci sono elementi nel carrello
        <div>
          <p>Total Cart Price: ${calculateTotalPrice()}</p>{" "}
          {/* Visualizza il prezzo totale del carrello */}
          {cartItems.length > 0 && (
            <Link to={`/checkout/${checkoutCode}`}>
              <button className='proceed-button'>
                PROCEED WITH YOUR ORDER
              </button>
            </Link>
          )}
          {cartItems.map((item) => (
            <div key={item.id} className='item'>
              {" "}
              {/* Elemento individuale nel carrello */}
              <img
                src={`/assets/items/${item.image}`}
                loading='lazy'
                alt={item.title}
              />
              <h2>{item.title}</h2> {/* Titolo dell'elemento */}
              <p>Typology: {item.typology}</p> {/* Tipologia dell'elemento */}
              <p>Unit Price: ${item.price}</p>{" "}
              {/* Prezzo unitario dell'elemento */}
              <p>Quantity: {item.quantity}</p>{" "}
              {/* Quantità dell'elemento nel carrello */}
              <button onClick={() => handleDecrementQuantity(item)}>
                -
              </button>{" "}
              {/* Pulsante per diminuire la quantità */}
              <button onClick={() => handleIncrementQuantity(item)}>
                +
              </button>{" "}
              {/* Pulsante per aumentare la quantità */}
              <p>Total Price: ${item.total}</p>{" "}
              {/* Prezzo totale per l'elemento (quantità * prezzo unitario) */}
              <button onClick={() => handleRemoveItem(item)}>
                Rimuovi dal carrello
              </button>{" "}
              {/* Pulsante per rimuovere l'elemento dal carrello */}
            </div>
          ))}
          {/* <CheckoutItems cartItems={cartItems} /> */}
        </div>
      )}
    </div>
  );
}
