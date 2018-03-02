/**
 * Configurable arguments
 */
module.exports = {
    round_id: 0,
    row_num : 3,
    col_num : 3,
    pop_size: 10,
    max_gen : 1,
    output_top: 0.1, // output top t% individuals
    output_step: 1, // output top individuals every k generation
    early_stop: 10, // terminates if no improvement in n generations
    elite_rate: 0.2, // remain e% top-fitness individuals as the elite
    mutation_rate: 0.2,
    crossover_rate: 0.2,
    database: 'mongodb://localhost:27017/CrowdJigsaw'
};
