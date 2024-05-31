// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FoodTracking {

    event NewFood(address sender, string productName, uint8 productId, uint8 price);

    event NewProvider(address newProvider);

    constructor() {
        roles[msg.sender] = Roles.ADMIN;
    }

    enum Roles {VIEWER, PROVIDER, ADMIN}

    struct Food {
        string name;
        uint8 id;
        uint8 price;
    }

    mapping(address => Roles) roles;
    mapping(address => Food[]) addressToFood;

    function addProvider(address _newProvider) public {
        require(roles[msg.sender] == Roles.ADMIN, "Only Admin can add new providers!");
        roles[_newProvider] = Roles.PROVIDER;
        emit NewProvider(_newProvider);
    }

    function addFood(string memory _productName, uint8 _productId, uint8 _price) public {
        require(roles[msg.sender] != Roles.VIEWER, "Viewer cannot use this function!");
        addressToFood[msg.sender].push(Food(_productName, _productId, _price));
        emit NewFood(msg.sender, _productName, _productId, _price);
    }

    function getFoodTrackedByAddress(address _address) public view returns(Food[] memory) {
        return addressToFood[_address];
    }

    function getFoodTrackedBySender() public view returns(Food[] memory) {
        return addressToFood[msg.sender];
    }

    function checkFoodNumber() public view returns(uint) {
        return addressToFood[msg.sender].length;
    }

    function getRole(address _address) public view returns(Roles) {
        return roles[_address];
    }

}