// var individual = require('./model');
const config = require('./config');
var { mongo } = require('./dbaccess');
var tester = require('./tester');
const utils = require('./utils');

const { Node: NodeModel, Individual } = require('./model');
const dirs = ['top', 'right', 'bottom', 'left'];

var { round_id, row_num, col_num, pop_size, max_gen,
    output_top, output_step, early_stop, elite_rate,
    mutation_rate, crossover_rate, database } = config;
/**
 * Init the gene dictionary
 */
var tile_num = row_num * col_num;
var pieces = new Array();
for (let i = 0; i < tile_num; i++) {
    pieces.push(i);
}

/**
 * Cenerate one individual
 */
var randCreate = () => {
    pieces.sort(utils.randomSort);
    return pieces;
};
/**
 * Generate the first generation by random
 * row_num col_num, popsize
 */
var population = new Array();
var nextPopulation = new Array();
var generation = 0;
var initialize = () => {
    for (let i = 0; i < pop_size; i++) {
        // let indiv=new Individual(randCreate(), 0);
        let indiv = new Object();
        indiv.gene = randCreate();
        indiv.fitness = 0;
        population.push(indiv);
    }
    generation = 0;
    // console.log(population);
};


/**
 * Calculate the fitness of the current generation, according to the db snapshot for this generation
 */
var calAllFitness = (generation) => {
    // get a nodes database snapshot
    var links = new Array();
    // store the links in one object
    var linksObject = Object.create(null);

    mongo.once('open', function () {
        // database.db.on('connected', function () {
        console.log('Connecting to ' + database);
        NodeModel.find({ round_id: round_id }).lean().exec(function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                if (docs != undefined && docs.length > 0) {
                    // convert nodes to links array
                    for (let node of docs) {
                        // console.log(node);
                        for (let dir of dirs) {
                            for (let end of node[dir]) {
                                let link = {
                                    from: node["index"],
                                    to: end.index,
                                    dir: dir,
                                    score: end.sup_num + end.opp_num
                                };
                                // links.push(link);
                                linksObject[link.from + dir + link.to] = link.score;
                            }
                        }
                    }
                    console.log(linksObject);
                    // hash the links array
                    // var linksHash = new HashSet();
                    // for (let link of links) {
                    //     if (!linksHash.add(link)) {
                    //         console.log("Hash error!");
                    //     }
                    // }
                    // console.log(linksHash.toArray());

                    // for each individual, generate the links
                    var indivLinks = new Array();
                    var indivFitness = 0;
                    // hash the links array and calculate its fitness
                    for (let l of indivLinks) {
                        if (linksObject.hasOwnProperty(l)) {
                            indivFitness += linksObject[l];
                        }
                    }
                    // assign the fitness to the individual

                    // output results every k generation
                    if (generation % output_step == 0) {
                        // console.log(population);
                    }

                } else {
                    console.log("No data");
                }
            }
        });
    });
};

/**
 * Rank all individuals in one generation(descending order)
 */
var rankIndivs = () => {
    popluation.sort(compare("fitness"));
};

/**
 * Remain e% top-fitness individuals as the elite 
 */
var remainElite = () => {
    nextPopulation = new Array();
    for (let i = 0; i < pop_size * elite_rate; i++) {
        nextPopulation.push(population[i]);
    }
};

/**
 * Select parents for crossover
 */
var roulette = () => {
    let totallFitness = 0;
    let choicePro = new Array(pop_size);
    let sumChoicePro = new Array(pop_size);
    for (let j = 0; j < pop_size; j++) {
        totallFitness += popluation[j].fitness;
    }
    for (let j = 0; j < pop_size; j++) {
        choicePro[j] = popluation[j].fitness / totallFitness;
        if (j != 0) {
            sumChoicePro[j] = sumChoicePro[j - 1] + choicePro[j];
        } else {
            sumChoicePro[j] = choicePro[j];
        }
    }
    for (let j = 0; j < pop_size - 1; j++) {
        let rand = Math.random();
        for (let k = 0; k < pop_size - 1; k++) {
            if (rand <= sumChoicePro[k]) {
                crossover(k, k + 1);
                break;
            }
        }
    }
};

/**
 * Crossover to generate new individual
 */
var crossover = (individual1, individual2) => {

};

/**
 * Swap two gene codes in one individual
 */
var swap = (individual, p1, p2) => {
    if (individual[p1] && individual[p2]) {
        let tmp = individual[p1];
        individual[p1] = individual[p2];
        individual[p2] = tmp;
    }
};
/**
 * Mutate some individuals to generate new ones
 */
var mutate = () => {
    for (let j = 0; j < pop_size; j++) {
        let temp = Math.random();
        if (temp < mutation_rate) {
            // mutate
            let individual = population[temp * pop_size];
            let position1 = Math.floor(Math.random() * tile_num);
            let position2;
            do {
                position2 = Math.floor(Math.random() * tile_num);
            } while (position2 == position1);
            swap(individual, position1, position2);
        }
    }
};

/**
 * Generate the next generation by:
 * 1, remain elites(rank by fitness)
 * 2, crossovers(roulette and crossover)
 * 3, mutations(random select and mutate)
 */
var get_next_gen = () => {
    remainElite();
    roulette();
    mutate();
    generation++;
};
/**
 * Main procedure
 */
initialize();
var passed = false;
var roundFinished=false; // cross-thread var
while (max_gen-- && (!passed)&&(roundFinished)) {
    calAllFitness();
    // get_next_gen();
    // passed=tester.testAll();
}