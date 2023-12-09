// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./plugins/RelayPlugin.sol";

contract MyContract is RelayPlugin {
    constructor(
        address _trustedOrigin,
        bytes4 _relayMethod
    ) RelayPlugin(_trustedOrigin, _relayMethod) {
        // constructor logic, if any
    }

    // Additional functionalities or overrides
    function requiresPermissions()
        external
        pure
        override
        returns (uint8 permissions)
    {
        // Return the appropriate permissions value
        // This is just an example value, adjust according to your contract's logic
        return 0;
    }
}
