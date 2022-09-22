const { expect } = require("chai");

const { ethers } = require("hardhat");

describe("Snake and Ladder game", function () {
  it("check if snakes array is loaded", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    const snakes = await snakeAndLadder.getAllSnakes();

    expect(snakes.length).to.equal(10);

    expect(snakes[0].start).to.equal(16);
    expect(snakes[0].end).to.equal(6);
  });

  it("check if ladders array is loaded", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    const ladders = await snakeAndLadder.getAllSnakes();

    expect(ladders.length).to.equal(10);

    expect(ladders[0].start).to.equal(16);
    expect(ladders[0].end).to.equal(6);
  });

  it("Check if game has not started", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    const gameStarted = await snakeAndLadder.isGameStarted();
    expect(gameStarted).to.equal(false);

    const gameEnded = await snakeAndLadder.isGameEnded();
    expect(gameEnded).to.equal(false);

    const totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(0);
  });

  it("Add one player and start the game", async function () {
    // Add a Promise, and check event is emitted
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    await snakeAndLadder.addPlayer(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );

    const totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(1);

    const playerId = await snakeAndLadder.getPlayerId(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );
    expect(playerId).to.equal(1);

    const playerPosition = await snakeAndLadder.getPlayerPosition(playerId);
    expect(playerPosition).to.equal(0);

    try {
      await snakeAndLadder.startGame();
    } catch (e) {
      expect(e.toString()).to.contains("AddMorePlayers");
    }
  });

  it("Add two repeated players", async function () {
    // Add a Promise, and check event is emitted
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    await snakeAndLadder.addPlayer(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );

    const totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(1);

    const playerId = await snakeAndLadder.getPlayerId(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );
    expect(playerId).to.equal(1);

    const playerPosition = await snakeAndLadder.getPlayerPosition(playerId);
    expect(playerPosition).to.equal(0);

    try {
      await snakeAndLadder.addPlayer(
        "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
      );
    } catch (e) {
      expect(e.toString()).to.contains("PlayerAlreadyExists");
    }
  });

  it("Add two players and start the game", async function () {
    // Add a Promise, and check event is emitted
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    await snakeAndLadder.addPlayer(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );

    let totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(1);

    const playerId1 = await snakeAndLadder.getPlayerId(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );
    expect(playerId1).to.equal(1);

    const playerPosition1 = await snakeAndLadder.getPlayerPosition(playerId1);
    expect(playerPosition1).to.equal(0);

    await snakeAndLadder.addPlayer(
      "0xdD870fA1b7C4700F2BD7f44238821C26f7392148"
    );

    totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(2);

    const playerId2 = await snakeAndLadder.getPlayerId(
      "0xdD870fA1b7C4700F2BD7f44238821C26f7392148"
    );
    expect(playerId2).to.equal(2);

    const playerPosition2 = await snakeAndLadder.getPlayerPosition(playerId2);
    expect(playerPosition2).to.equal(0);

    await snakeAndLadder.startGame();

    const gameStarted = await snakeAndLadder.isGameStarted();
    expect(gameStarted).to.equal(true);

    const chanceId = await snakeAndLadder.getChance();
    expect(chanceId).to.equal(1);
  });
});
