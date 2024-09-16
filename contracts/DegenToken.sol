// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DegenToken is ERC20 {
    address owner;
    uint256 itemCount;

    struct MarketItem {
        uint256 id;
        address itemOwner;
        string name;
        uint256 price;
    }

    address[] public ListOfPlayers;

    mapping(uint256 => MarketItem) public marketItems;

    error IncorrectbetEntryPrice();
    error NoParticipants();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint");
        _;
    }

    constructor() ERC20("Degen", "DGN") {
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function addToMarket(string memory _name, uint256 _price) public onlyOwner {
        itemCount++;
        MarketItem storage marketItem = marketItems[itemCount];
        marketItem.id = itemCount;
        marketItem.itemOwner = msg.sender;
        marketItem.name = _name;
        marketItem.price = _price;
    }

    function burn(uint256 value) public {
        require(balanceOf(msg.sender) >= value, "Insufficient balance");
        _burn(msg.sender, value);
    }

    function redeem(uint8 _id) public {
        require(_id <= itemCount, "id is out of bounds");
        _transfer(msg.sender, marketItems[_id].itemOwner, marketItems[_id].price);
        marketItems[_id].itemOwner = msg.sender;
    }
}
