//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";
    //usuario ha de poder marcar que ha asistido a clase, cada clase tendrá un id (numero)
    //el sc tendrá que guardar el propietario del mismo
    //funcion privada
    //funcion de crear nueva clase, que solo pueda llamar el owner (modificador)
    //contador de clases, las diferentes clases a las que han asistido

contract Ownable {

    address private owner;

    mapping(address => bool) public isAdmin;

    event onOwnerChange(address newOwner);
    event onAddAdmin(string addedAdminMsg);

    constructor(address collectionOwner) {
        owner = collectionOwner;
        console.log("ADMIN ADDRESS: ", collectionOwner);
        isAdmin[collectionOwner] = true;
    }


    function transferOwnership(address callerAddress, address newOwner) public virtual onlyAdmin(callerAddress) {
        //address(0) direccion invalida, se usa para quemar tokens por ejemplo,
        //address(this) para referirse a la direccion del contrato
        require(msg.sender != address(0), "Invalid new owner");
        //eventos, es buena practica emitir eventos , esta informacion se envia desde la blockchain pero no se guarda en la bc
        //se verá en el log del debug 
        emit onOwnerChange(newOwner);
        owner = newOwner;
    }

     function addAdmin(address _owner, address wallet) public virtual onlyOwner(_owner) {
        require(isAdmin[wallet] == false, "Already admin");
        isAdmin[wallet] = true;
        emit onAddAdmin("Admin anyadido!");
    }

    function removeAdmin(address callerAddress, address wallet) public virtual onlyAdmin(callerAddress) {
        require(isAdmin[wallet] == true, "Need to be admin");
        isAdmin[wallet] = false;
    }


    modifier onlyAdmin(address callerAddress) {
        require(isAdmin[callerAddress] == true, "Not admin");
         _;
    }

    modifier onlyOwner(address ownerAddress) {
        require(ownerAddress == owner, "Not owner");
        _;
    }
 }