const mongoose = require("mongoose"); 

/**
 * The individual of the population
 */
class individual{
    // gene=undefined; // string representation for a jigsaw proposal
    // fitness= 0; // fitness score
    constructor(gene, fitness){
        this.gene=gene;
        this.fitness=fitness;
    }
    get gene(){
        return this.gene;
    }
    set gene(value){
        this.gene=value;
    }
    get fitness(){
        return this.fitness
    }
    set fitness(value){
        this.fitness=value
    }
};

var NodeSchema = new mongoose.Schema({
    index: { type: Number,required: true, index:true }, // index of the center node
    round_id:{ type: Number,required: true, index:true  },
    top:[{
        index: { type: Number },
        sup_num:  { type: Number, default:0 },
        opp_num:  { type: Number, default:0 }
    }],
    right:[{
        index: { type: Number },
        sup_num:  { type: Number, default:0 },
        opp_num:  { type: Number, default:0 }
    }],
    bottom:[{
        index: { type: Number },
        sup_num:  { type: Number, default:0 },
        opp_num:  { type: Number, default:0 },
    }],
    left:[{
        index: { type: Number },
        sup_num:  { type: Number, default:0 },
        opp_num:  { type: Number, default:0 },
    }]
});

console.log('Node Schema Created.');

module.exports={
    Individual: individual,
    Node :  mongoose.model('Node', NodeSchema)
};