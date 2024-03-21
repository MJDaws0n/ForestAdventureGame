const { clear } = require('node:console');

function game2(wordAlternatives){
    var name = '';
    coolTypingEffect('Welcome to the Forest Exploring Story Game.' , ()=>{
        function doName(callback){
            function getName(x){
                name = x;
                callback();
            }
            coolTypingEffect('Lets get started with some infomation.\nWhat\'s your name?',()=>{
                getInput('> ', (x)=>{getName(x)});
            });
        }
        doName(()=>{
            coolTypingEffect(`Are you ready to play ${name}?`,()=>{
                function readyToPlay(callback){
                    getInput('> ', (response)=>{
                        if(!wordMatches('yes', response, wordAlternatives)){
                            coolTypingEffect(`I think we should try that again! Are you ready to play ${name}`,()=>{
                                readyToPlay(callback);
                                return;
                            });
                        } else{
                            callback();
                        }
                    });
                }
                readyToPlay(()=>{
                    coolTypingEffect('Alright then, let\'s play',()=>{
                        coolTypingEffect('Your plane has just been shot down. You have just found yourself in an mysterious forest...',()=>{
                            coolTypingEffect('Which direction do you head?',()=>{
                                function direction(callback){
                                    getInput('> ', (response)=>{
                                        if(!(
                                            wordMatches('forward', response, wordAlternatives) ||
                                            wordMatches('right', response, wordAlternatives) ||
                                            wordMatches('backward', response, wordAlternatives) ||
                                            wordMatches('left', response, wordAlternatives)
                                        )){
                                            coolTypingEffect(`I'm not sure which direction that is ${name}. Lets try: Forwards, Backwards, Left or Right`,()=>{
                                                direction(callback);
                                                return;
                                            });
                                        } else{
                                            if(wordMatches('forward', response, wordAlternatives)){
                                                callback('forward');
                                            }
                                            if(wordMatches('right', response, wordAlternatives)){
                                                callback('right');
                                            }
                                            if(wordMatches('backward', response, wordAlternatives)){
                                                callback('backward');
                                            }
                                            if(wordMatches('left', response, wordAlternatives)){
                                                callback('left');
                                            }
                                        }
                                    });
                                }
                                direction((direction)=>{
                                    async function gameStep() {
                                        var find = await findLoc();
                                        coolTypingEffect(find.name, ()=>{
                                            console.log('Done');
                                        });
                                    }

                                    gameStep();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
async function game(wordAlternatives){
    await coolTypingEffect('Hello');
    await coolTypingEffect('How are you');
}
getWordAlternatives((wordAlternatives)=>{
    game(wordAlternatives);
});


/**
 * Asks for an input from the user 
 * 
 * @param {String} title - What you wish to ask the user
 * @param {Function} callback - The function that should be ran with the user input as the first param
 */
function getInput(title, callback){
    const readline = require('node:readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
      
    rl.question(title, (userInput) => {
        rl.close();
        callback(userInput);
    });
}
function getWordAlternatives(rootCallback){
    const fs = require('fs');

    function readJSONFile(filename, callback) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                return callback(err);
            }
            try {
                const json = JSON.parse(data);
                callback(null, json);
            } catch (error) {
                callback(error);
            }
        });
    }
    const filePath = './wordAlternatives.json';

    readJSONFile(filePath, (err, json) => {
        if (err) {
            rootCallback(false);
            return;
        }
        rootCallback(json);
    });
}
function wordMatches(word, input, alternatives){
    if(alternatives[word.toLowerCase()]){
        return alternatives[word.toLowerCase()].includes(input.toLowerCase());
    } else{
        return false;
    }
}
function coolTypingEffect(word) {
    const typingSpeed = 20; // Adjust this value to control typing speed
    const delay = Math.floor(1000 / (word.length * typingSpeed));

    return new Promise(resolve => {
        var i = 0;
        run();
        function run() {
            setTimeout(() => {
                process.stdout.write(word.charAt(i));
                i++;
                if (word.charAt(i) == '\n') {
                    console.log();
                }
                if (i != word.length) {
                    run();
                } else {
                    console.log();
                    resolve();
                }
            }, delay * 10);
        }
    });
}
function clearConsole(){
    var lines = process.stdout.getWindowSize()[1];
    for(var i = 0; i < lines; i++) {
        console.log('\r\n');
    }
}
function findLoc(callback){
    return new Promise(resolve => {
        const fs = require('fs');

        function readJSONFile(filename, callback) {
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    return callback(err);
                }
                try {
                    const json = JSON.parse(data);
                    callback(null, json);
                } catch (error) {
                    callback(error);
                }
            });
        }
        const filePath = './thingsToFind.json';

        readJSONFile(filePath, (err, json) => {
            // Generate a random index
            const randomIndex = Math.floor(Math.random() * json.length);

            // Access the randomly chosen location
            const randomlyChosenLocation = json[randomIndex];
                resolve(randomlyChosenLocation);
        });
    });
}