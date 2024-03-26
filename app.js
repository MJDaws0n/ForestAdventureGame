const { clear } = require('node:console');

const inventory = {
    items: [
        {
            name: 'knife',
            type: 'weapon'
        }
    ],
    add: async function(name, type, saturation, amount){
        const newItem = {
            name: name,
            type: type
        };

        if(saturation){
            newItem['saturation'] = saturation;
        }

        await coolTypingEffect('Added '+amount+' '+name+'\'s to your inventory');

        for(var i = 0; i < amount; i++){
            this.items.push(newItem)
        }
    }
};

const places = {
    village: async function(name){
        await coolTypingEffect('Village man -> "Welcome to the village, explorer. What\'s your name?"');
        await coolTypingEffect('Me -> "Me...? I am '+name+'."');
        await coolTypingEffect('Village man -> "What can I do for you '+name+'?"');
        await coolTypingEffect('What help would you like:\na) Ask for some food.\nb) Ask for some medical help for a cut you just discovered on your leg.\nc) Ask for some money that may come in handy at some point.\nd) Leave.\ne) Rob him.');
        
        // Get the letter input
        while(!['a', 'b', 'c', 'd', 'e'].includes(action = await getInput('> '))){
            await coolTypingEffect('Village man -> "I have no clue what you want. Try and explain again."');
            await coolTypingEffect('What help would you like:\na) Ask for some food.\nb) Ask for some medical help for a cut you just discovered on your leg.\nc) Ask for some money that may come in handy at some point.\nd) Leave.\ne) Rob the village man.');
        }

        // Do action
        if(action.toLowerCase() == 'a'){
            await coolTypingEffect('Village man -> "Of course '+name+'! Here are some baked potatoes for you."');
        }
        if(action.toLowerCase() == 'b'){
            await coolTypingEffect('Village man -> "Here. Let use treat your cut '+name+'!"');
        }
        if(action.toLowerCase() == 'c'){
            await coolTypingEffect('Village man -> "Errrm. I\'m not sure how far money will get you on this island '+name+'!"');
            await coolTypingEffect('Me -> "This is an is an island????"');
            await coolTypingEffect('Village man -> "Yes. This is an island."');
        }
        if(action.toLowerCase() == 'e'){
            await coolTypingEffect('Me -> "Give me everything you have got or I will kill you!!"');
            await coolTypingEffect('Village man -> "I suggest you leave. Now!"');
            await coolTypingEffect('Me -> "What! You think you scare me!"');
            await coolTypingEffect('Tribal men holding spears surround you. What do you do:');

            await coolTypingEffect('a) Run.\nb) Fight.');

            // Get the letter input
            while(!['a', 'b'].includes(choice = await getInput('> '))){
                await coolTypingEffect('That it not something you can do here. Quick pick, they are closing in on you!');
            }

            if(choice.toLowerCase() == 'a'){
                await coolTypingEffect('You escape gaining nothing.');
            }
            if(choice.toLowerCase() == 'b'){
                await coolTypingEffect('Me -> "Alright then, lets see it."');

                await coolTypingEffect('Pick a random number between 1 and 2 to see if you win or loose the fight.');

                // Get the number
                while(!['1', '2'].includes(numberChoice = await getInput('> '))){
                    await coolTypingEffect('That is not a valid choice. Quick pick, they are closing in on you!');
                }

                const randomNumber = Math.random();

                if(randomNumber < 0.5){ // The actual input is irrelevant it's all luck based
                    await coolTypingEffect('You fool. They surrounded you, and beat you to death.');
                } else{
                    await coolTypingEffect('Me -> "Phew! I got away with it. And I got some cooked pork. Thank god that knife came in handy. Lets hope no-one finds this village. Everyone is dead now!"');
                    inventory.add(name = 'cooked pork', type = 'food', saturation = 6, amount = 4);
                }
            }
        }
        if(action.toLowerCase() == 'd'){
            await coolTypingEffect('Village man -> "Goodbye and good luck traveler."');
        }
    }
};

async function game(wordAlternatives){
    // Game start
    await coolTypingEffect('Welcome to the Forest Exploring Story Game.');
    const name = await getInput('Lets start with your name\n> ');
    await coolTypingEffect('Are you ready to play '+name+'?');

    // Ready to play
    while(!wordMatches(wordAlternatives, await getInput('> '), ['yes'])){
        await coolTypingEffect('Lets try this again! Are you ready to play?');
    }

    // Game start
    await coolTypingEffect('Your plane has just been shot down. You have just found yourself in an mysterious forest...');

    // Move direction
    while(!wordMatches(wordAlternatives, direction = await getInput('Which direction do you head?\n> '), ['forward', 'right', 'backwards', 'left'])){
        await coolTypingEffect('Sorry I\'m not sure which way that is, try North South East or West.');
    }

    await coolTypingEffect('Heading '+direction+'...');
    await wait(1000);
    clearConsole();
    
    // Visit the village
    await places.village(name);
}
getWordAlternatives((wordAlternatives)=>{
    game(wordAlternatives);
});


/**
 * Asks for an input from the user 
 * 
 * @param {String} title - What you wish to ask the user
 */
function getInput(title){
    const readline = require('node:readline');

    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question(title, (userInput) => {
            rl.close();
            resolve(userInput);
        });
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
function wordMatches(alternatives, input, words){
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (alternatives[word.toLowerCase()]) {
            if (alternatives[word.toLowerCase()].includes(input.toLowerCase())) {
                return word;
            }
        }
    }
    return false;
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
function wait(delay){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}