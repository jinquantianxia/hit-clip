import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/antd.css";
import { AliveScope } from "react-activation";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<AliveScope>
		<App />
	</AliveScope>
);
