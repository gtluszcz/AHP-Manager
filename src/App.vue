<template>
    <div>
        <h1 class="title">AHP manager</h1>
        <h3 class="subtitle">
            made by:
            <a href="https://github.com/gtluszcz">@gtluszcz</a>
            <a href="https://github.com/dczajkowski">@DCzajkowski</a>
        </h3>

        <file-picker @file="newFile"></file-picker>

        <div>
            <div class="alternatives">
                <div class="controls-wrap">
                    <button class="left big" @click="subtract" :disabled="alternatives.length === 0">-</button>
                    <button class="right big" @click="add">+</button>
                </div>

                <input
                    type="text"
                    class="alt alternative"
                    v-for="alter in alternatives"
                    v-model="alter.value"
                    placeholder="alternative"
                    :key="alter"
                >
            </div>

            <div class="row">
                <div class="links">
                    <recursive-madness
                        :subtree="tree"
                        :initial-criterion="tree.name"
                        :key="tree.name"
                    ></recursive-madness>
                </div>
                <div class="rechts">
                    <question
                        :subtree="tree"
                        :initial-criterion="tree.name"
                        :key="tree.name"
                    ></question>
                    <question2
                        :subtree="tree"
                        :initial-criterion="tree.name"
                        :alternatives="alternatives"
                        :key="Math.random()"
                    ></question2>
                </div>
            </div>

            <div class="result">
                <pre v-text="renderedTree()"></pre>
            </div>
        </div>
    </div>
</template>

<script>
    import RecursiveMadness from './components/RecursiveMadness'
    import Question from './components/Question'
    import Question2 from './components/Question2'
    import FilePicker from './components/FilePicker'

    export default {
        props: ['alternatives', 'tree'],
        name: 'App',
        components: {
            RecursiveMadness,
            Question,
            Question2,
            FilePicker,
        },
        methods: {
            add() {
                this.$root.alternatives.push({ value: '' })
                this.$root.setLastMatrixes(this.tree)
            },
            subtract() {
                this.$root.alternatives.splice(this.$root.alternatives.length - 1, 1)
                this.$root.setLastMatrixes(this.tree)
            },
            newFile(contents) {
                this.$root.tree = this.convertToOurs(contents)
                this.$root.$forceUpdate()
            },
            renderedTree() {
                const goal = {}

                goal.alternatives = this.$root.alternatives.map(el => el.value)
                goal[this.tree.name] = this.renderNode(this.tree)

                return JSON.stringify(goal, null, 2)
            },
            renderNode(node) {
                if (node.criteria != null && node.criteria.length > 0) {
                    const goal = {}

                    goal['matrix'] = node.matrix.map(el => el.value)

                    for (const sub of node.criteria) {
                        goal[sub.name] = this.renderNode(sub)
                    }

                    return goal
                }
                return node.matrix.map(el => el.value)
            },
            convertToOurs(contents) {
                this.$root.alternatives = contents.alternatives.map(el => ({ value: el }))

                const goal = Object.keys(contents).filter(c => c !== 'alternatives')[0]
                const obj = this.convertNodeToOurs(contents[goal], goal)

                return obj

            },
            convertNodeToOurs(node,name){
                const obj = {}

                obj.name = name
                obj.criteria = []

                if (!Array.isArray(node)) {
                    obj.matrix = node.matrix.map(el => ({ value: el }))

                    for (const crit of Object.keys(node).filter(c => c !== 'matrix')){
                        obj.criteria.push(this.convertNodeToOurs(node[crit], crit))
                    }
                } else {
                    obj.matrix = node.map(el => ({ value: el }))
                }

                return obj
            },
        },
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    body {
        background: linear-gradient(180deg, rgb(35, 200, 219) 0%, rgb(27, 156, 212) 50%, rgb(74, 86, 226) 100%);
        min-width: 100vw;
        color: white;
        font-family: Montserrat;
        min-height: 100vh;
    }

    .title {
        margin: 0 auto;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-top: 100px;
        margin-bottom: 10px;
    }

    .subtitle {
        margin: 0 auto;
        text-align: center;
        font-weight: 100;
        font-size: 16px;
        margin-bottom: 2rem;
    }

    a, a:focus {
        text-decoration: none;
        color: inherit;
    }

    .level {
        padding-left: 40px;
        padding-top: 5px;
        display: flex;
        flex-direction: column;
    }

    .cell, .alt {
        min-width: 200px;
        text-align: left;
        background-color: transparent;
        outline: none;
        border: none;
        font-weight: 600;
        margin: 0;
        padding: 0 20px;
        font-family: Montserrat;
        font-size: 20px;
        transition: 0.1s width ease;
        color: white;
        opacity: 1;

    }

    .cell::placeholder {
        color: white;
        opacity: 0.4;
    }

    .alt::placeholder {
        opacity: 0.4;
        color: cornflowerblue;
    }

    .alt {
        min-width: 40px;
        width: 120px;
        height: 36px;
        margin: 2px 10px;
        flex-shrink: 0;
        background-color: white;
        color: cornflowerblue;
        text-align: center;
        border-radius: 18px;
        line-height: 36px;
    }

    .nest {
        padding-left: 2rem;
    }

    #recursive-madness {
        display: none;
    }

    button {
        width: 24px;
        height: 20px;
        background-color: white;
        float: right;
        border: 0;
        outline: none;
        line-height: 20px;
        text-align: center;
    }

    button.right {
        border-radius: 12px 0 0 12px;
        border-right: 1px solid #ccc;
    }

    button.left {
        border-radius: 0px 12px 12px 0px;
    }

    button.round {
        border-radius: 12px;
    }

    button.big {
        width: 36px;
        height: 36px;
        line-height: 36px;
        font-size: 20px;
        color: #666;
        margin: 2px 0;
    }

    button.right.big {
        border-radius: 18px 0 0 18px;
        border-right: 1px solid #ccc;
    }

    button.left.big {
        border-radius: 0px 18px 18px 0px;
    }

    button.round.big {
        border-radius: 18px;
    }

    .row {
        display: flex;
        justify-content: flex-start;
    }

    .links, .rechts {
        width: calc(50vw);
    }

    .rechts {
        margin-top: -30px;
    }

    textarea.result {
        display: block;
        border: 0;
        /*width: 100%;*/
        box-sizing: border-box;
        width: calc(100% - 120px);
        height: 30rem;
        margin: 120px 60px 0;
        resize: none;
    }

    .result {
        margin: 0 calc(40px + 20px);
        margin-bottom: 100px;
        margin-top: 2rem;
        overflow-x: scroll;
        background: #292b36;
        padding: 1rem 1.5rem;
        border-radius: 0 3px 3px;
        text-align: left;
        font-family: monospace;
        font-size: .9rem;
        font-weight: 300;
        color: #fff;
        -webkit-box-shadow: inset 0 0 12px #151515, 1px 1px 11px #464646;
        box-shadow: inset 0 0 12px #151515, 1px 1px 11px #464646
    }

    .controls-wrap {
        width: 72px;
        margin-right: 20px;
    }

    .alternatives {
        padding: 0 calc(40px + 20px);
        margin: 40px 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    #app {
        display: flex;
        flex-direction: column;
    }

    .number {
        width: 36px;
    }

    .parent {
        text-align: center;
        width: 460px;
        margin: 30px 0 10px;
    }

    .wrap {
        padding-right: 60px;
    }
</style>
