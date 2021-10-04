const axios = require("axios");
// const url = "http://localhost:5000/constellations";
const supersUrl = "https://superheroapi.com/api/4363646247062985";
const insultUrl = "https://evilinsult.com/generate_insult.php?lang=en&type=json"

const battle = (hero, villian) => {
    let heroVictories = 0
    let heroPowers = Object.values(hero.powerstats);
    let villianPowers = Object.values(villian.powerstats);

    for (let i = 0; i < heroPowers.length; i++){
        victory = heroPowers[i] - villianPowers[i];
        if(victory > 0) {heroVictories++}
        else if(victory < 0) {heroVictories--};
    }

    return heroVictories;
}

const matchSuper = (potentialSupers, name) => {
    let foundSuper = potentialSupers.find(superMatch => superMatch.name === name);
    if(!foundSuper) foundSuper = potentialSupers[0];
    return foundSuper;
}

const allies = (hero, villian) => {
    const heroAlignment = hero.biography.alignment;
    const villianAlignment = villian.biography.alignment;
    
    return heroAlignment === villianAlignment;
}

const findSuper = async (hero, villian) => {
    const potentialHeros = (await axios.get(`${supersUrl}/search/${hero}`)).data.results;
    const potentialVillians = (await axios.get(`${supersUrl}/search/${villian}`)).data.results;

    const foundHero = potentialHeros.length - 1 ? matchSuper(potentialHeros, hero) : potentialHeros[0];
    const foundVillian = potentialVillians.length - 1 ? matchSuper(potentialVillians, villian) : potentialVillians[0];

    return [foundHero, foundVillian]
}

const unknown = async (name) => {
    const isMissing = (await axios.get(`${supersUrl}/search/${name}`)).data;
    return !isMissing.results;
}

const battleStory = async (hero, villian, aftermath) => {
    if (aftermath === 0){
        return "StaleMate";
    }
    const fighter = aftermath > 0 ? ["", hero, villian] : ["", villian, hero];
    const insult = (await axios.get(insultUrl)).data.insult;
    return `${fighter[1].name} defeated ${fighter[2].name}, and gazing down at such a weak foe sneered, "${insult}"`

}

const Superbattle = async (heroName, villianName) => {
    if(await unknown(heroName)) return "The first super is unknown, please input another super.";
    if(await unknown(villianName)) return "The second super is unknown, please input another super.";

    const [hero, villian] = await findSuper(heroName, villianName);
    if(allies(hero,villian)) return "These supers are allies, they won't fight. Please choose characters that do not morally align.";

    const aftermath = battle(hero, villian);
    return battleStory(hero, villian, aftermath);
}


module.exports = {Superbattle};