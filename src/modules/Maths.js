import numeric from 'numeric'

class Maths {
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

    static eigenvector(A) {
        console.log(A.map(el => el.value))
        const matrix = Maths.convert2dMatrixTo3d(A.map(el => el.value))

        console.log(matrix)

        const result = numeric.eig(matrix)

        if (typeof result.E.y !== 'undefined' || typeof result.lambda.y !== 'undefined' ) {
            throw 'Complex eigenvalues and eigenvectors are not supported yet'
        }

        const vector1 = [result.E.x[0][0], result.E.x[1][0], result.E.x[2][0]]
        const vector2 = [result.E.x[0][1], result.E.x[1][1], result.E.x[2][1]]
        const vector3 = [result.E.x[0][2], result.E.x[1][2], result.E.x[2][2]]

        const value1 = result.lambda.x[0]
        const value2 = result.lambda.x[1]
        const value3 = result.lambda.x[2]

        const maxValue = Math.max(value1, value2, value3)
        let vector

        if (value1 == maxValue) {
            vector = vector1
        } else if (value2 == maxValue) {
            vector = vector2
        } else if (velue3 == maxValue) {
            vector = vector3
        } else {
            throw 'Ugh, oh. Floats do suck'
        }

        return vector.map(el => el / vector.reduce((accumulator, currentValue) => accumulator + currentValue))
    }
}

export default Maths
