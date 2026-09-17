//=============================================================================
// RPG Maker MZ - Brandon Battle
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Brandon Battle.
 * @author Akshat Iyer
 *
 * @help BrandonFight.js
 *
 * This plugin provides commands to control the Brandon Fight.
 *
 * Use it in the following procedure.
 *   1. Call the plugin command "Set Text Picture".
 *   2. Execute "Show Picture" without specifying an image.
 *
 * @command initializeBrandonBattle // command
 * @text Set Text Picture
 * @desc Sets text to display as a picture.
 *       After this, execute "Show Picture" without specifying an image.
 *
 * @type multiline_string
 * @text Initialize Brandon Battle
 * @desc Text to display as a picture.
 *       Control characters are allowed.
 *
 *
 *
 * @command getBrandonText // command
 * @text Get Brandon Text
 * @desc Sets text to display as a picture.
 *       After this, execute "Show Picture" without specifying an image.
 *
 * @type multiline_string
 * @text Get Brandon Text
 * @desc Text to display as a picture.
 *       Control characters are allowed.
 */


(() => {
    class BrandonFightManager {
        constructor() {
            this.word = "";
            this.typedWord = "";
            this.active = false;
            this.timer = null;
            this.timeLeft = 5;
            this.currentWordIndex = 0;
        }

        static startTypingChallenge(word, timeout) {
            this.word = word;
            this.typedWord = "";
            this.active = true;

            // SceneManager._scene.hideAllUI(); // ⬅️ Hide UI immediately
            SceneManager._scene.refreshTypingUI();

        }
        static handleKeyInput(letter) {
            if (!this.active) return;
            if (letter === "Backspace") {
                this.typedWord = this.typedWord.slice(0, -1);
            } else {
                this.typedWord += letter;
            }

            SceneManager._scene.refreshTypingUI();

            if (this.typedWord === this.word) {
                this.typedWord = "";
                if (!this.currentWordIndex) {
                    this.currentWordIndex = 0;
                }
                this.currentWordIndex += 1;
                // const brandonScript = [
                //     "Hey what’s that?",
                //     "Got your credit card!!!!!",
                //     "It’s not breaking the law if I don’t get caught. \nPlus, even if I do, I’ll move to",
                //     "text 4"
                // ];
                // console.log(brandonScript[this.currentWordIndex]);
                // $gameMessage.add(brandonScript[this.currentWordIndex]);
                $gameSwitches.setValue(2, true);
                $gameVariables.setValue(14, this.currentWordIndex);
            }
        }
    }




    window.BrandonFightManager = new BrandonFightManager();




    Scene_Map.prototype.getRandomWord = function() {
        const words = ["fire", "magic", "sword", "shield", "dragon"];
        return words[Math.floor(Math.random() * words.length)];
    };

    Scene_Map.prototype.refreshTypingUI = function() {
        if (!this._typingWindow) {
            this._typingWindow = new Window_Base(new Rectangle(300, 50, 600, 100));
            this.addWindow(this._typingWindow);
        }
        this._typingWindow.contents.clear();
        this._typingWindow.drawText("Type: " + BrandonFightManager.word, 0, 0, 380, "left");
        this._typingWindow.drawText("You: " + BrandonFightManager.typedWord, 0, 40, 380, "left");
    };

    Scene_Map.prototype.clearTypingUI = function() {
        if (this._typingWindow) {
            this._typingWindow.hide();
            this._typingWindow.destroy(); // Remove window instance
            this._typingWindow = null; // Reset reference
        }

        this.restoreAllUI(); // Bring back UI
    };



    PluginManager.registerCommand("BrandonFight", "initializeBrandonBattle", function(args) {
        // Procedures run when executing a command are written here.
        console.log("HI");
        const arg0 = args[0];
        const arg1 = Number(args[1]);
        const words = [
            "bruh",
            "moment",
            "fuck",
            "help"
        ];
        const timeouts = [
            60,
            120,
            120,
            60
        ]
        const word = words[$gameVariables.value(14)];
        const timeout = timeouts[$gameVariables.value(14)];
        BrandonFightManager.startTypingChallenge(arg0, arg1);
    });

    PluginManager.registerCommand("BrandonFight", "getBrandonText", function(args) {

        console.log("Get Next Flavor Text");
        const brandonScript = [
            "If you’re not going to tell me your credit card number, \n guess I’ll just have to find it myself!",
            "text 2",
            "text 3",
            "text 4"
        ];
        // $gameVariables.setValue(14, 1);
        console.log(brandonScript[$gameVariables.value(14)]);
        $gameMessage.clear();
        $gameMessage.add(brandonScript[$gameVariables.value(14)]);

    });

    Scene_Map.prototype.restoreAllUI = function() {
        // if (this._hiddenWindows) {
        //     this._hiddenWindows.forEach(win => win.show());
        //     this._hiddenWindows = [];
        // }
    };

    const alias_inputOnKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        alias_inputOnKeyDown.call(this, event);
        if (/^[a-zA-Z/0123456789.,!?;:'"()\-_+=<>$%^&* ]$/.test(event.key) || event.key === "Backspace") {
            BrandonFightManager.handleKeyInput(event.key);
        }
    };

    console.log("BrandonFight.js is fully loaded and active!");
})();