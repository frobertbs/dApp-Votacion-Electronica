let account;
let Address;

window.onload = function() {
    fetch('smartcontract')
        .then(response => response.text())
        .then(data => {
            Address = data;
            console.log("Address fetched:" + data);
        })
        .catch(error => console.error(error));


};

const connectMetamask = async() => {
    if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
    }
    const ABI = [{
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [{
                "internalType": "string",
                "name": "name",
                "type": "string"
            }],
            "name": "addCandidate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "name": "candidates",
            "outputs": [{
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "candidatesCount",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "concludeVoting",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "returnWinner",
            "outputs": [{
                "internalType": "string",
                "name": "winner",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }],
            "name": "setVoters",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "n",
                "type": "uint256"
            }],
            "name": "showName",
            "outputs": [{
                "internalType": "string",
                "name": "name",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "voteTotal",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "winnerId",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        }
    ];


    document.getElementById("subStatus").innerText = "Estado de : " + Address;

    window.web3 = await new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, Address);

    document.getElementById("connectTxt").innerText = "Conectado";
    document.getElementById("connectInd").style.backgroundColor = 'aquamarine';
    document.getElementById("loginPage").style.display = 'none';
    document.getElementById("panelPage").style.display = 'block';

    const winner = await window.contract.methods.returnWinner().call();
    if (winner) {
        document.getElementById("Status").innerHTML = "La votacion ha terminado";
        var disable = document.querySelectorAll(".disable-this");
        disable.forEach(function(button){
            button.classList.add("disable-btn");
        })
    } else {
        document.getElementById("Status").innerHTML = "La votación está activa";
    }
}


//for Admin

const setCanditates = async() => {
    const myEntry = document.getElementById("candidateName").value;
    await window.contract.methods.addCandidate(myEntry).send({ from: account });
    document.getElementById("Status").innerText = "Candidato añadido";
}

const setVoters = async() => {
    const myEntry = document.getElementById("voterAddr").value;
    await window.contract.methods.setVoters(myEntry).send({ from: account });
    document.getElementById("Status").innerText = "Votante añadido";
}

const totVotes = async() => {
    const data = await window.contract.methods.voteTotal().call();
    document.getElementById("totalVote").innerText = "{ Número de votos: " + data + " }";
    document.getElementById("Status").innerText = "Recuento de votos obtenido recientemente";
}

const concludeVoting = async() => {
    await window.contract.methods.concludeVoting().send({ from: account });
    document.getElementById("Status").innerText = "La votación ha terminado";
}

const showWinner = async() => {
    const data = await window.contract.methods.returnWinner().call();
    if (data === "") {
        document.getElementById("Status").innerHTML = "Terminar votación para ver el ganador";
    } else {
        document.getElementById("Status").innerHTML = "<span class='display-5'>🎉</span> Candidato <strong>" + data + "</strong> ha ganado la votación <span class='display-5'>🎉</span>";
    }

}

async function getList() {
    const data = await window.contract.methods.candidatesCount().call();
    document.getElementById("writeList").innerHTML = ""; //clearing the list

    for (var i = 0; i < data; i++) {
        const data = await window.contract.methods.showName(i + 1).call();
        var addList = document.createElement("li");
        addList.classList.add("list-group-item");
        addList.innerText = data;
        document.getElementById("writeList").appendChild(addList);
    }

    document.getElementById("Status").innerText = "Lista de candidatos obtenida recientemente";
}

//for Voter

async function getCandidates() {
    const winner = await window.contract.methods.returnWinner().call();

    if (winner) {
        document.getElementById("candidate-list").innerHTML = "<div class='h1 text-center mt-5'><h6>La votación ha finalizado</h6><span class='display-5'>🎉</span> Candidato <strong>" + winner + "</strong> ha ganado la votación <span class='display-5'>🎉</span></div>";
    } else {

        const data = await window.contract.methods.candidatesCount().call();
        document.getElementById("candidate-list").innerHTML = ""; //clearing the list

        for (var i = 0; i < data; i++) {
            const data = await window.contract.methods.showName(i + 1).call();
            var addList = document.createElement("li");
            addList.classList.add("list-group-item");
            addList.setAttribute('value', i + 1);
            addList.innerText = data;
            document.getElementById("candidate-list").appendChild(addList);
        }
    }


}




const vote = async() => {
    const selectedListItem = document.querySelector('#candidate-list li.selected');
    if (selectedListItem) {
        await window.contract.methods.vote(selectedListItem.getAttribute('value')).send({ from: account });
    } else {
        alert('Por favor selecciona un elemento de la lista');
    }

}
