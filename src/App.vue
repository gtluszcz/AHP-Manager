<template>
    <div class="container">
        <h1 class="title">AHP manager</h1>
        <h3 class="subtitle">
            Made by
            <a href="https://github.com/gtluszcz">Grzegorz Tłuszcz</a>
            and
            <a href="https://github.com/dczajkowski">Dariusz Czajkowski</a>
        </h3>

        <file-picker @file="newFile"></file-picker>

        <div>
            <h3>Alternatives</h3>
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
                    :key="alter.id"
                >
            </div>

            <div class="row row-top">
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

            <!-- <div class="weights">
                <h3>Weights</h3>
                <div class="row weights__row" v-for="(weight, index) in priorityVector()" :key="index">
                    <span>{{ alternatives[index].value }}</span><span>{{ weight.toFixed(3) }}</span>
                </div>
            </div> -->

            <div class="result">
                <div class="hanger">
                    <div class="file" @click="download" title="Download file">
                        <svg fill="#fff" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
                            <path d="M0 0h24v24H0z" fill="none"></path>
                        </svg>
                    </div>
                    <div
                        class="clipboard"
                        ref="clipboard"
                        :data-clipboard-text="JSON.stringify(renderedTree())"
                        title="Copy to clipboard"
                    >
                        <svg fill="#fff" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
                        </svg>
                    </div>
                </div>
                <pre v-text="prettyResult()"></pre>
            </div>
        </div>
    </div>
</template>

<script>
    import RecursiveMadness from './components/RecursiveMadness'
    import Question from './components/Question'
    import Question2 from './components/Question2'
    import FilePicker from './components/FilePicker'
    import eventHub from './eventHub'
    import Clipboard from 'clipboard'
    import Maths from './modules/Maths'

    export default {
        props: ['alternatives', 'tree'],
        name: 'App',
        mounted() {
            eventHub.$on('update', () => this.$forceUpdate())

            new Clipboard(this.$refs.clipboard)
        },
        components: {
            RecursiveMadness,
            Question,
            Question2,
            FilePicker,
        },
        methods: {
            add() {
                this.$root.alternatives.push({ value: '', id: Math.random() })
                this.$root.setLastMatrixes(this.tree)
            },
            subtract() {
                this.$root.alternatives.splice(this.$root.alternatives.length - 1, 1)
                this.$root.setLastMatrixes(this.tree)
            },
            newFile(contents) {
                this.$root.tree = this.convertToOurs(contents)
                eventHub.$emit('update')
            },
            renderedTree() {
                const goal = {}

                goal.alternatives = this.$root.alternatives.map(el => el.value)
                goal[this.tree.name] = this.renderNode(this.tree)

                return goal
            },
            priorityVector() {
                return (this.tree.matrix.length === 0 || this.alternatives.length === 0)
                    ? ''
                    : Maths.nodeVector(this.tree)
            },
            prettyResult() {
                return JSON.stringify(this.renderedTree(), (k, v) => (v instanceof Array) ? JSON.stringify(v) : v, 2)
                    .replace(/"\[/g, '[')
                    .replace(/\]"/g, ']')
                    .replace(/\\"/g, '"')
                    .replace(/""/g, '"')
                    .replace(/,(.)/g, ', $1')
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

                return this.convertNodeToOurs(contents[goal], goal)
            },
            convertNodeToOurs(node, name) {
                const obj = {}

                obj.name = name
                obj.criteria = []

                if (!Array.isArray(node)) {
                    obj.matrix = node.matrix.map(el => ({ value: el }))

                    for (const criterion of Object.keys(node).filter(c => c !== 'matrix')) {
                        obj.criteria.push(this.convertNodeToOurs(node[criterion], criterion))
                    }
                } else {
                    obj.matrix = node.map(el => ({ value: el }))
                }

                return obj
            },
            _download(filename, text) {
                const element = document.createElement('a')

                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
                element.setAttribute('download', filename)

                element.style.display = 'none'

                document.body.appendChild(element)

                element.click()

                document.body.removeChild(element)
            },
            download() {
                this._download(`${this.tree.name}.json`, JSON.stringify(this.renderedTree()))
            },
        },
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Montserrat, Arial, sans-serif;
    }

    body {
        background: linear-gradient(180deg, rgb(35, 200, 219) 0%, rgb(27, 156, 212) 50%, rgb(74, 86, 226) 100%);
        min-height: 100vh;
        color: white;
        display: flex;
        justify-content: center;
    }

    .container {
        width: 100%;
        max-width: 1000px;
        padding: 0 2rem;
    }

    .title {
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-top: 6rem;
        margin-bottom: 1rem;
    }

    .subtitle {
        text-align: center;
        font-weight: 100;
        font-size: 1rem;
        margin: 0 auto 2rem;
    }

    .subtitle a,
    .subtitle a:focus {
        font-style: italic;
        text-decoration: none;
        color: inherit;
    }

    .level {
        padding-left: 40px;
        padding-top: 5px;
        display: flex;
        flex-direction: column;
    }

    .cell {
        flex: 1;
        text-align: left;
        background-color: transparent;
        outline: none;
        border: none;
        font-weight: 600;
        margin: 0;
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

    .row > .alt:not(.number) {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .alt.number {
        width: 3rem;
        text-align: center;
        margin: 0 1rem;
    }

    .row {
        margin-bottom: 1rem;
    }

    .parent {
        margin: 3rem 0 1rem;
        display: flex;
        justify-content: center;
    }

    .alt {
        padding: .7rem 1rem;
        background: #fff;
        color: cornflowerblue;
        border-radius: 5rem;
        border: none;
        outline: none;
        height: 2.5rem;
    }

    .alternatives > .alt {
        margin-right: 1rem;
        margin-bottom: 1rem;
    }

    .rechts {
        margin-top: -3rem;
    }

    .nest {
        padding-left: 2rem;
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

    .result {
        margin-bottom: 100px;
        overflow-x: scroll;
        background: #292b36;
        padding: 1rem 1.5rem;
        border-radius: 0 3px 3px;
        text-align: left;
        font-family: monospace;
        font-size: .9rem;
        font-weight: 300;
        color: #fff;
        box-shadow: inset 0 0 12px #151515, 1px 1px 11px #464646;
        position: relative;
    }

    .hanger {
        display: flex;
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
    }

    .hanger > div {
        margin-left: 1rem;
    }

    .controls-wrap {
        width: 4.5rem;
        margin-right: 20px;
    }

    .buttons {
        width: 4.5rem;
    }

    h3 {
        margin-top: 3rem;
        margin-bottom: 1rem;
    }

    .alternatives {
        margin: 0 0 7rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .alternatives:after {
        content: '';
        flex: auto;
    }

    .links > .level {
        padding-left: 0;
    }

    .row-top {
        display: flex;
        margin-bottom: 3rem;
    }

    .links, .rechts {
        flex: 1;
    }

    .links {
        padding-right: 2rem;
    }

    .rechts {
        padding-left: 2rem;
    }

    .row {
        display: flex;
    }

    .weights {
        margin-top: 5rem;
        margin-bottom: 5rem;
    }

    .weights__row > span {
        flex: 1;
    }

    .weights__row > span:first-child {
        text-align: right;
        padding-right: 1rem;
    }

    .weights__row > span:last-child {
        padding-left: 1rem;
    }

    @media (max-width: 930px) {
        .row-top {
            flex-direction: column;
        }

        .rechts {
            margin-top: 2rem;
        }
    }
</style>
