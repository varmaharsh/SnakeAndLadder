// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error GameStarted();
error PlayerAlreadyExists(address);
error AddMorePlayers();
error InvalidNumberOnDice();
error NotYourChance();
error CannotAddMorePlayers();

contract SnakeAndLadder {
    event PlayerAdded(address, uint8);
    event GameEnded(uint8);

    struct SnakeLadder {
        uint16 start;
        uint16 end;
    }

    // max 4
    uint8 private playerId = 1;
    uint8 private chance;
    uint8 private winner;
    bool private gameStarted = false;
    bool private gameEnded = false;

    SnakeLadder[] private snakesList;
    SnakeLadder[] private ladderList;

    // players of the game
    mapping(address => uint8) private addressToPlayerId;
    mapping(uint8 => uint16) private playerPositions;
    mapping(uint16 => uint16) private snakes;
    mapping(uint16 => uint16) private ladders;

    constructor() {
        snakesList.push(SnakeLadder(16, 6));
        snakesList.push(SnakeLadder(46, 25));
        snakesList.push(SnakeLadder(49, 11));
        snakesList.push(SnakeLadder(62, 19));
        snakesList.push(SnakeLadder(64, 60));
        snakesList.push(SnakeLadder(74, 53));
        snakesList.push(SnakeLadder(89, 68));
        snakesList.push(SnakeLadder(92, 88));
        snakesList.push(SnakeLadder(95, 75));
        snakesList.push(SnakeLadder(99, 80));
        for (uint16 i = 0; i < snakesList.length; i++) {
            SnakeLadder memory tempSnake = snakesList[i];
            snakes[tempSnake.start] = snakes[tempSnake.end];
        }
        ladderList.push(SnakeLadder(2, 38));
        ladderList.push(SnakeLadder(7, 14));
        ladderList.push(SnakeLadder(8, 31));
        ladderList.push(SnakeLadder(36, 44));
        ladderList.push(SnakeLadder(15, 26));
        ladderList.push(SnakeLadder(21, 42));
        ladderList.push(SnakeLadder(36, 44));
        ladderList.push(SnakeLadder(51, 67));
        ladderList.push(SnakeLadder(71, 91));
        ladderList.push(SnakeLadder(78, 98));
        ladderList.push(SnakeLadder(87, 94));
        for (uint16 i = 0; i < ladderList.length; i++) {
            SnakeLadder memory tempLadder = ladderList[i];
            ladders[tempLadder.start] = ladders[tempLadder.end];
        }
    }

    modifier hasGameStarted() {
        if (gameStarted) {
            revert GameStarted();
        }
        _;
    }

    modifier hasGameNotStarted() {
        if (!gameStarted) {
            revert GameStarted();
        }
        _;
    }

    modifier doesPlayerAlreadyExist(address _playerAddress) {
        if (addressToPlayerId[_playerAddress] == 0) {
            revert PlayerAlreadyExists(_playerAddress);
        }
        _;
    }

    modifier checkNumberOnDice(uint8 _numberOnDice) {
        if (_numberOnDice < 1 || _numberOnDice > 6) {
            revert InvalidNumberOnDice();
        }
        _;
    }

    modifier canAddPlayers() {
        if (playerId == 4) {
            revert CannotAddMorePlayers();
        }
        _;
    }

    function addPlayer(address _playerAddress)
        public
        hasGameStarted
        canAddPlayers
        doesPlayerAlreadyExist(_playerAddress)
    {
        addressToPlayerId[_playerAddress] = playerId;
        playerPositions[playerId] = 0;
        playerId++;
        emit PlayerAdded(_playerAddress, playerId);
    }

    modifier checkPlayersChance(uint8 _playerId) {
        if (_playerId != chance) {
            revert NotYourChance();
        }
        _;
    }

    function startGame() public hasGameStarted {
        if (playerId == 1) {
            revert AddMorePlayers();
        }
        gameStarted = true;
        chance = 1;
    }

    function incrementPlayer(bool _goToNextPlayer) internal {
        if (!_goToNextPlayer) {
            return;
        }
        if (chance == playerId) {
            chance = 1;
        } else {
            chance++;
        }
    }

    function checkWinner() internal returns (bool) {
        if (playerPositions[playerId] >= 100) {
            gameEnded = true;
            winner = playerId;
            return true;
        }
        return false;
    }

    function makeMove(uint8 _playerId, uint8 _numberOnDice)
        public
        hasGameNotStarted
        checkNumberOnDice(_numberOnDice)
        checkPlayersChance(_playerId)
    {
        bool goToNextPlayer = true;
        // player hasn't entered the board
        if (playerPositions[_playerId] == 0) {
            // start only with a 6
            if (_numberOnDice == 6) {
                playerPositions[_playerId] = 1;
                goToNextPlayer = false;
            }
        } else {
            uint16 newPosition = playerPositions[_playerId] + _numberOnDice;
            playerPositions[_playerId] = newPosition;
            if (checkWinner()) {
                emit GameEnded(winner);
            }
            if (snakes[newPosition] != 0) {
                playerPositions[_playerId] = snakes[newPosition];
            } else if (ladders[newPosition] != 0) {
                playerPositions[_playerId] = ladders[newPosition];
                goToNextPlayer = false;
            }
        }
        incrementPlayer(goToNextPlayer);
    }

    function getChance() public view returns (uint8) {
        return chance;
    }

    function getPlayerId(address _playerAddress) public view returns (uint8) {
        return addressToPlayerId[_playerAddress];
    }

    function isGameStarted() public view returns (bool) {
        return gameStarted;
    }

    function isGameEnded() public view returns (bool) {
        return gameEnded;
    }

    function getTotalPlayers() public view returns (uint8) {
        return playerId;
    }

    function getWinner() public view returns (uint8) {
        return winner;
    }

    function getPlayerPosition(uint8 _playerId) public view returns (uint16) {
        return playerPositions[_playerId];
    }

    function getAllSnakes() public view returns (SnakeLadder[] memory) {
        return snakesList;
    }

    function getAllLadders() public view returns (SnakeLadder[] memory) {
        return ladderList;
    }
}
