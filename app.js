Vue.component('recursive-madness', {
    props: ['subtree', 'initialCriterion'],
    template: '#recursive-madness',
    data() {
        return {
            criterion: this.initialCriterion,
        }
    },
    methods: {
        add() {
            this.subtree.criteria.push({
                'name': '',
                'matrix': [],
                'criteria': [],
            })

            this.setMatrix()
            this.$root.setLastMatrixes(this.$root.tree)
        },
        subtract(name) {
            this.$parent.subtree.criteria.splice(this.$parent.subtree.criteria.indexOf(this.subtree), 1)

            this.setMatrix()
            this.$root.setLastMatrixes(this.$root.tree)
        },
        setMatrix() {
            this.subtree.matrix = []

            const n = this.subtree.criteria.length

            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    this.subtree.matrix[i * n + j] = (i === j) ? { value: 1 } : { value: 0 }
                }
            }
        },
        onBlur() {
            this.subtree.name = this.criterion
        },
    },
})

Vue.component('question', {
    props: ['subtree', 'initialCriterion',],
    template: '#question',
    methods: {
        refresh(subtree, i, j, event) {
            subtree.matrix[j * subtree.criteria.length + i].value = parseFloat(1 / event.target.value)

            this.$root.$forceUpdate()
        },
    },
})

Vue.component('question2', {
    props: ['subtree', 'initialCriterion', 'alternatives'],
    template: '#question2',
    methods: {
        refresh(subtree, i, j, event) {
            subtree.matrix[j * this.$root.alternatives.length + i].value = parseFloat(1 / event.target.value)

            this.$root.$forceUpdate()
        },
    },
})

new Vue({
    el: '#app',
    data: {
        alternatives: [],
        tree: {
            'name': 'Goal',
            'matrix': [],
            'criteria': [],
        },
    },
    methods: {
        renderedTree() {
            const goal = {}

            goal.alternatives = this.alternatives.map(el => el.value)
            goal[this.tree.name] = this.renderNode(this.tree)

            return JSON.stringify(goal, null, 2)
        },
        renderNode(node) {
            if (node.criteria != null && node.criteria.length > 0) {
                const goal = {}

                goal['matrix'] = node.matrix.map(el => el.value)

                for (sub of node.criteria) {
                    goal[sub.name] = this.renderNode(sub)
                }

                return goal
            } else {
                return node.matrix.map(el => el.value)
            }
        },
        add() {
            this.alternatives.push({ value: '' })
            this.setLastMatrixes(this.tree)
        },
        setLastMatrixes(node) {
            if (node.criteria != null && node.criteria.length > 0) {
                for (i of node.criteria) {
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
        subtract() {
            this.alternatives.splice(this.alternatives.length - 1, 1)
            this.setLastMatrixes(this.tree)
        },
    },
})
