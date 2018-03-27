import Numeric from 'Numeric'

class Maths {
    static priorityVector(node) {
        if (node.criteria.length === 0) {
            return this._calculate(node.matrix)
        }

        const compareVector = this._calculate(node.matrix)

        let vector = 0
        let counter = 0

        for (let el of compareVector) {
            vector = Numeric.add(vector, Numeric.mul(el, this.priorityVector(node.criteria[counter])))
            counter++
        }

        return vector
    }

    static convert2dMatrixTo3d(matrix2d) {
        const matrix3d = []
        const n = Math.sqrt(matrix2d.length)

        for (let i = 0; i < n; i++) {
            matrix3d[i] = []
            for (let j = 0; j < n; j++) {
                matrix3d[i][j] = matrix2d[i * n + j]
            }
        }

        return matrix3d
    }
}


export default Maths
