/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

class SceneNode {
    constructor(meshDrawer, trs, parent = null) {
        this.meshDrawer = meshDrawer;
        this.trs = trs;
        this.parent = parent;
        this.children = [];

        if (parent) {
            this.parent.__addChild(this);
        }
    }

    __addChild(node) {
        this.children.push(node);
    }

    draw(mvp, modelView, normalMatrix, modelMatrix) {
        // First, apply this node's transformation to all matrices
        // Each child will receive these transformed matrices as input
        var transformedModel = MatrixMult(modelMatrix, this.trs.getTransformationMatrix());
        var transformedModelView = MatrixMult(modelView, this.trs.getTransformationMatrix());
        var transformedMvp = MatrixMult(mvp, this.trs.getTransformationMatrix());
        var transformedNormals = MatrixMult(normalMatrix, this.trs.getRotationMatrix());

        // Draw the current node if it has a mesh
        if (this.meshDrawer) {
            this.meshDrawer.draw(transformedMvp, transformedModelView, transformedNormals, transformedModel);
        }

        // Propagate the transformed matrices to all children
        // This ensures that child transformations are applied on top of parent transformations
        for (let child of this.children) {
            child.draw(
                transformedMvp,          // Child will multiply its transform with parent's transformed MVP
                transformedModelView,     // Child will multiply its transform with parent's transformed ModelView
                transformedNormals,       // Child will multiply its transform with parent's transformed Normals
                transformedModel         // Child will multiply its transform with parent's transformed Model matrix
            );
        }
    }

    

}