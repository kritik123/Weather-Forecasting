import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { FaReact } from "react-icons/fa";

const FooterComponent = () => {
  const { theme, colorTheme } = useContext(ThemeContext);
  return (
    <div
      className={`text-${colorTheme} pb-3`}
      style={{
        backgroundColor: theme === "dark" ? "#292929" : "#e8ebee"
      }}
    >
      <div
        className={`flex flex-col text-center sm:flex sm:flex-row justify-around p-5 text-${colorTheme} text-sm`}
      >
        <p className="my-2 sm:my-0 w-full sm:w-1/3">
          <a
            href="https://github.com/kritik123/weather-forecasting"
            target="_blank"
            rel="noreferrer noopener"
            className={`link z-0 hover:text-${theme}`}
          >
            GitHub{" "}
          </a>{" "}
        </p>{" "}
        <p className="flex flex-no-wrap justify-center my-2 sm:my-0 w-full sm:w-1/2">
          Made with &nbsp;{" "}
          <span title="Love" role="img" aria-label="Love" className="text-lg">
            {" "}
            ❤️
          </span>{" "}
          &nbsp; using &nbsp;
          <span
            title="React"
            role="img"
            aria-label="React"
            className="text-lg text-react"
          >
            <FaReact />
          </span>{" "}
        </p>{" "}
        <p className="my-2 sm:my-0 w-full sm:w-1/3">
          <Link to="/privacy-policy" className={`link z-0 hover:text-${theme}`}>
            Privacy Policy{" "}
          </Link>{" "}
        </p>{" "}
      </div>{" "}
      <p className="mx-auto text-center text-sm">
        &copy; {moment().format("YYYY")}{" "}
        <a
          className={`link z-0 hover:text-${theme}`}
          href="https://kritik123.github.io/portfolio1/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Kritik Shivanshu{" "}
        </a>{" "}
      </p>{" "}
    </div>
  );
};

export default FooterComponent;
