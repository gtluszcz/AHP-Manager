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
        //console.log(A.map(el => el.value))
        const matrix = Maths.convert2dMatrixTo3d(A.map(el => el.value))

        //console.log(matrix)

        const result = numeric.eig(matrix)


        if (typeof result.E.y !== 'undefined' || typeof result.lambda.y !== 'undefined' ) {
            throw 'Complex eigenvalues and eigenvectors are not supported yet'
        }


        let maxLambdaIndex = 0
        for(let i=0;i<result.lambda.x.length;i++){
            if (result.lambda.x[i]>result.lambda.x[maxLambdaIndex]){
                maxLambdaIndex=i
            }
        }
        //console.log(result.E.x)

        let transpose = result.E.x[0].map((x,i) => result.E.x.map(x => x[i]))

        //console.log(transpose)

        let vector = transpose[maxLambdaIndex]

        return vector.map(el => el / numeric.sum(vector))
    }
}

export default Maths
