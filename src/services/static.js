const path = require('path')
const express = require('express')

module.exports = (app) => {
    
    // Serve static folder and docs server
    const project_parent_folder = path.resolve(__dirname, '../..')
    const joined_path = path.join(project_parent_folder, 'public/')
    app.use('/', express.static(joined_path))
}
