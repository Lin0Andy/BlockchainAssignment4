// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 private _blockReward;

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _mint(msg.sender, totalSupply);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, _blockReward);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view {
        if (from != address(0)) {
            require(balanceOf(from) >= amount, "ERC20: transfer amount exceeds balance");
        }
    }

    function setBlockReward(uint256 amount) external onlyOwn {
        _blockReward = amount;
    }

    function destroy() external onlyOwn {
        require(totalSupply() > 0, "No tokens to destroy");
        address payable recipient = payable(owner());
        recipient.transfer(address(this).balance);
        _burn(recipient, balanceOf(recipient));
    }

    function transferTo(address to, uint256 amount) public returns (bool) {
        _beforeTokenTransfer(msg.sender, to, amount);
        _transfer(msg.sender, to, amount);
        _mintMinerReward();
        return true;
    }

    modifier onlyOwn() {
        require(_msgSender() == owner(), "Ownable: caller is not the owner");
        _;
    }
}
