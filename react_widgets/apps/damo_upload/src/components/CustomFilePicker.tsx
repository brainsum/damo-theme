// import { useState } from 'react';

// const CustomDropzone = () => {
//   const [fileTree, setFileTree] = useState([]);

//   const handleDrop = async (event) => {
//     event.preventDefault();
//     const items = event.dataTransfer.items;
//     let promises = [];

//     for (let i = 0; i < items.length; i++) {
//       const entry = items[i].webkitGetAsEntry();
//       if (entry) {
//         promises.push(processEntry(entry, ''));
//       }
//     }

//     // Process the entries and integrate them into the existing tree
//     const newFiles = await Promise.all(promises);
//     integrateEntries(newFiles.flat());
//   };

//   // Handle input change for files
//   const handleFileInputChange = async (event) => {
//     const files = event.target.files;
//     let promises = [];

//     for (let i = 0; i < files.length; i++) {
//       promises.push(processFile(files[i], ''));
//     }

//     // Process the entries and integrate them into the existing tree
//     const newFiles = await Promise.all(promises);
//     integrateEntries(newFiles);
//   };

//  // Handle input change for directories (preserve folder structure using webkitRelativePath)
//  const handleDirectoryInputChange = async (event) => {
//   const files = event.target.files;
//   let newFileTree = [];

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const relativePath = file.webkitRelativePath.split('/');
//     let currentLevel = newFileTree;

//     // Rebuild the folder structure
//     for (let j = 0; j < relativePath.length; j++) {
//       const part = relativePath[j];

//       // If we're at the last part, it's a file
//       if (j === relativePath.length - 1) {
//         currentLevel.push({
//           path: file.webkitRelativePath,
//           name: file.name,
//           type: 'file',
//         });
//       } else {
//         // Otherwise it's a directory
//         let existingFolder = currentLevel.find(item => item.name === part && item.type === 'directory');
//         if (!existingFolder) {
//           existingFolder = {
//             path: relativePath.slice(0, j + 1).join('/'),
//             name: part,
//             type: 'directory',
//             children: [],
//           };
//           currentLevel.push(existingFolder);
//         }
//         currentLevel = existingFolder.children;
//       }
//     }
//   }

//   integrateEntries(newFileTree);
// };


//    // Process file from input or drag-and-drop
//    const processFile = (file, path) => {
//     return new Promise((resolve) => {
//       resolve({
//         path: path + file.name,
//         name: file.name,
//         type: 'file',
//       });
//     });
//   };

//   const processEntry = (entry, path) => {
//     return new Promise((resolve) => {
//       if (entry.isFile) {
//         entry.file((file) => {
//           resolve({
//             path: path + file.name,
//             name: file.name,
//             type: 'file',
//           });
//         });
//       } else if (entry.isDirectory) {
//         const dirReader = entry.createReader();
//         readAllEntries(dirReader).then((entries) => {
//           let dirPath = path + entry.name + '/';
//           let promises = entries.map(subEntry => processEntry(subEntry, dirPath));
//           Promise.all(promises).then((nestedFiles) => {
//             resolve({
//               path: dirPath,
//               name: entry.name,
//               type: 'directory',
//               children: nestedFiles,
//             });
//           });
//         });
//       }
//     });
//   };

//   const readAllEntries = (dirReader, allEntries = []) => {
//     return new Promise((resolve) => {
//       dirReader.readEntries((entries) => {
//         if (entries.length) {
//           readAllEntries(dirReader, allEntries.concat(entries)).then(resolve);
//         } else {
//           resolve(allEntries);
//         }
//       });
//     });
//   };

//   // Integrate new entries directly into the existing file tree
//   const integrateEntries = (newEntries) => {
//     const updatedTree = [...fileTree];

//     newEntries.forEach(newEntry => {
//       const index = updatedTree.findIndex(entry => entry.path === newEntry.path);
//       if (index !== -1) {
//         // Update existing entry
//         updatedTree[index] = newEntry;
//       } else {
//         // Add new entry
//         updatedTree.push(newEntry);
//       }
//     });

//     setFileTree(updatedTree);
//   };

//   const renderFileTree = (nodes) => nodes.sort((a, b) => {
//     if (a.type === b.type) {
//       return a.name.localeCompare(b.name);
//     }
//     return a.type === 'directory' ? -1 : 1;
//   }).map((node, index) => (
//     <li key={index}>
//       {node.type === 'directory' ? `📁 ${node.name}` : `📄 ${node.name}`}
//       {node.children && <ul>{renderFileTree(node.children)}</ul>}
//     </li>
//   ));

//   return (
//     <div>
//       <div
//         onDrop={handleDrop}
//         onDragOver={(e) => e.preventDefault()}
//         onDragEnter={(e) => e.preventDefault()}
//         style={{ border: '2px dashed gray', padding: '20px', marginBottom: '20px' }}
//       >
//         Drag and drop files or directories here
//       </div>

//       {/* File upload input */}
//       <input
//         type="file"
//         multiple
//         style={{ display: 'block', marginBottom: '10px' }}
//         onChange={handleFileInputChange}
//       />

//       {/* Directory upload input */}
//       <input
//         type="file"
//         webkitdirectory="true" // Enables directory upload
//         style={{ display: 'block', marginBottom: '20px' }}
//         onChange={handleDirectoryInputChange}
//       />

//       <div>
//         <h4>Uploaded Files and Directories:</h4>
//         <ul>{renderFileTree(fileTree)}</ul>
//       </div>
//     </div>
//   );
// };

// export default CustomDropzone;