// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Voting {
    address private immutable owner;
    uint private conclude;
    uint public candidatesCount;
    uint public voteTotal;
    uint public winnerId;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) private voters;
    mapping(address => bool) private rights;

    constructor() {
        owner = msg.sender;
    }

    function setVoters(address addr) public {
        require(msg.sender == owner, "Solo el creador del contrato puede establecer los votantes");
        rights[addr] = true;
    }

    function addCandidate(string memory name) public {
        require(msg.sender == owner, "Solo el creador del contrato puede establecer los votantes");
        require(voteTotal == 0, "No se puede enviar candidato despues de que haya comenzado la votacion");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    function vote(uint candidateId) public {
        require(rights[msg.sender], "El votante no tiene derecho a votar");
        require(msg.sender != owner, "El creador del contrato no puede participar en la votacion.");
        require(!voters[msg.sender], "Voto ya emitido desde esta direccion");
        require(candidateId > 0 && candidateId <= candidatesCount, "ID de candidato invalido");
        require(candidatesCount >= 2, "Debe haber al menos 2 candidatos antes de que se puedan emitir los votos");
        require(conclude == 0, "Votacion Concluida");
        voters[msg.sender] = true;
        candidates[candidateId].voteCount++;
        voteTotal++;
    }

    function concludeVoting() public {
        require(msg.sender == owner, "Solo el creador del contrato puede concluir la votacion.");
        uint maxVote = 0;
        for(uint i=1; i<=candidatesCount; i++) {
            if(candidates[i].voteCount > maxVote) {
                winnerId = i;
                maxVote = candidates[i].voteCount;
            }
        }
        conclude += 1;
    }


    function returnWinner()public view returns (string memory winner) {
        return(candidates[winnerId].name);
    }

    function showName(uint n) public view returns (string memory name) {
         return(candidates[n].name);
    }
}
