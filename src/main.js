import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<app :tree="tree" :alternatives="alternatives"></app>',
    components: {
        App,
    },
    data: {
        alternatives: [],
        tree: {
            'name': 'Goal',
            'matrix': [],
            'criteria': [],
        },
    },
    methods: {
        setLastMatrixes(node) {
            if (node.criteria != null && node.criteria.length > 0) {
                for (const i of node.criteria) {
                    this.setLastMatrixes(i)
                }
            } else {
                node.matrix = []

                const n = this.alternatives.length

                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < n; j++) {
                        node.matrix[i * n + j] = (i === j) ? { value: 1 } : { value: 0 }
                    }
                }
            }
        },
    },
})
