<template>
    <div class="file-picker">
        <label for="file">
            <span>Upload Custom File</span>
            <input id="file" type="file" name="file" @change="processFile" accept=".json">
        </label>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fileContent: '',
            }
        },
        methods: {
            processFile(e) {
                const file = e.target.files[0]

                if (file) {
                    const reader = new FileReader()

                    reader.readAsText(file, 'UTF-8')

                    reader.onload = e => {
                        this.fileContent = e.target.result
                        this.$emit('file', JSON.parse(this.fileContent))
                    }
                    reader.onerror = () => this.fileContent = 'An error occurred'
                }
            },
        },
    }
</script>

<style scoped>
    .file-picker {
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .file-picker span {
        width: 14rem;
        height: 3rem;
        border-radius: 3rem;
        font-size: 1rem;
        cursor: pointer;
        background: #fff;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    label > input {
        display: none;
    }
</style>
