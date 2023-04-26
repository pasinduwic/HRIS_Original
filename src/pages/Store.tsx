import { Col, Row } from "react-bootstrap";
import StoreItem from "../components/StoreItem";
import { useSelector } from "react-redux";
import { useState } from "react";
// import storeItems from "../data/items.json";

const storeItems = [
  {
    id: 1,
    name: "Book",
    price: 100,
    imgUrl: "/images/book.jpg"
  },
  {
    id: 2,
    name: "Laptop",
    price: 200,
    imgUrl: "/images/laptop.jpg"
  },
  {
    id: 3,
    name: "Car",
    price: 300,
    imgUrl: "/images/car.jpg"
  },
  {
    id: 4,
    name: "House",
    price: 400,
    imgUrl: "/images/house.jpg"
  },
  {
    id: 5,
    name: "Land",
    price: 500,
    imgUrl: "/images/land.jpg"
  }
];
const Store = () => {
  return (
    <div className="store">
      <Row md="2" xs="1" lg="4" className="g-3">
        {storeItems.map((item: any) => (
          <Col key={item.id}>
            <StoreItem {...item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Store;
