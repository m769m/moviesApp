import React from "react";
import { Tabs } from "antd";

import Context from "../../context/genres-context";

import "./Header.css";

const Header = () => {
  const items = [
    {
      key: "1",
      label: "Search",
    },
    {
      key: "2",
      label: "Rated",
    },
  ];

  return (
    <Context.Consumer>
      {({ changeTab }) => (
        <div className="header">
          <Tabs defaultActiveKey="1" items={items} onChange={changeTab} />
        </div>
      )}
    </Context.Consumer>
  );
};

export default Header;
