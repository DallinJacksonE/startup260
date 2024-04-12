
import React from "react";
import { BuildAdminTable, BuildUserTable } from "./showOrders";
import { DeleteAccount } from "./deleteAccount";

export function UserPage() {
  return (
    <main>
        <h2>Your Orders</h2>
        <div id="userEndOrders">
            <BuildUserTable />
        </div>
        <hr />
        <h2>Delete Account</h2>
        <p>Warning: This action is irreversible, orders that haven't shipped may be lost in the system, please wait until all products have been delivered or conatct Kaylie with any concerns.</p>
        < DeleteAccount />
    </main>
  );
}