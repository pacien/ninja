var Montage = require("montage/core/core").Montage;
var cmObject = require("ninjaapp/js/io/system/coreioapi"),
    cm = cmObject.CoreIoApi,
    rootPath1 = "Users/kfg834/Documents/Ninja Projects/FTest1/", //specify any path within your ninja projects root folder
    rootPath2 = "Users/kfg834/Documents/Ninja Projects/FTest2/", 
    InitDirPath1 = "Users/kfg834/Documents/Ninja Projects/";

describe('Shell API', function() {

    describe('File IO', function() {

        // File Create Tests
        describe('File Create Tests', function() {

          it('Create File', function() {
            Creating Initial Main Directories in the documents folder
            var dir = {uri:InitDirPath1 + "FTest1"};
            var retVal = cm.createDirectory(dir);
            var dir = {uri:InitDirPath1 + "FileTest2"};
            var retVal = cm.createDirectory(dir);

            var file = {uri:rootPath1 + "NewFile1.txt"};

            var retVal = cm.createFile(file);
            console.log("First create returned:" + retVal.status);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(201);

           });
           

          it('Create Existing File', function() {

            var file = {uri:rootPath1 + "NewFile1.txt"};
            var retVal = cm.createFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(400);

            //Cleaning up the files by deleting after each test
            var file = {uri:rootPath1 + "NewFile1.txt"};
            var retVal = cm.deleteFile(file);

          });

        });


        // File Delete
        describe('File Delete Tests', function() {

          it('Delete File', function() {

            //Set up
            var file = {uri:rootPath1 + "NewFile1.txt"};
            var retVal = cm.createFile(file);

            var file = {uri:rootPath1 + "NewFile1.txt"};
            var retVal = cm.deleteFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

          });

        });


        // File Exists test 
        describe('File Exists Tests', function() {

          it('File Exists', function() {

            //Set up
            var file = {uri:rootPath1 + "NewFile1.txt"};
            var retVal = cm.createFile(file);
            console.log("Called createFile for Exists which returned " + retVal);

            var file = {uri:rootPath1 + "NewFile1.txt"};

            var retVal = cm.fileExists(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

          });

          it('File Does Not Exist', function() {

            var file = {uri:rootPath1 +"NewFile2.txt"};

            var retVal = cm.fileExists(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(404);

            //Clean up
            var file = {uri:rootPath1 + "NewFile1.txt"};
            var retVal = cm.deleteFile(file);

          });

        });



        // Copy a file
        describe('File Copy Tests', function() {

        it('Copy File', function() {

            //Set up
            var file = {uri:rootPath1 + "FileCopy.txt"};
            var retVal = cm.createFile(file);
            console.log("Called createFile for Copy which returned " + retVal);

            var file = {sourceUri: "/"+ rootPath1 + "FileCopy.txt", destUri: rootPath2 + "FileCopy.txt"};

            var retVal = cm.copyFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

        });

        it('Copy File To The Same Directory', function() {

            var file = {sourceUri: "/" + rootPath1 + "FileCopy.txt", destUri: rootPath2 + "FileCopy.txt"};

            var retVal = cm.copyFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).not.toEqual(204);

        });

        it('Copy File To Another Directory Containing A File With The Same Name', function() {

            var file = {sourceUri:"/"+rootPath1 +"FileCopy.txt", destUri: rootPath2 + "FileCopy.txt"};

            var retVal = cm.copyFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).not.toEqual(204);

            //Clean up
            var file = {uri:rootPath1 + "FileCopy.txt"};
            var retVal = cm.deleteFile(file);
            var file = {uri:rootPath2 + "FileCopy.txt"};
            var retVal = cm.deleteFile(file);

        });

       });


      // Move a file
      describe('File Move Tests', function() {

          it('Move File', function() {

            var file = {uri:rootPath1+"FileMove.txt"};
            var retVal = cm.createFile(file);
            console.log("Called createFile for Move which returned " + retVal);

            var file = {sourceUri:"/" + rootPath1+"FileMove.txt", destUri: rootPath2+"FileMove.txt"};

            var retVal = cm.moveFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

          });


          it('Move File To The Same Location', function() {

            var file = {sourceUri:"/" +rootPath2+"FileMove.txt", destUri: rootPath2+"FileMove.txt"};

            var retVal = cm.moveFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).not.toEqual(204);

            var file = {uri:rootPath2 + "FileMove.txt"};
            var retVal = cm.deleteFile(file);

          });

        });

        // Update a file
        describe('File Update Tests', function() {

           it('Update File', function() {

            var file = {uri:rootPath1+"FileUpdate.txt"};
            var retVal = cm.createFile(file);
            console.log("Called createFile for Update which returned " + retVal);

            var file = {uri:rootPath1+"FileUpdate.txt", contents: "Hello Binal"};
            var retVal = cm.updateFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

           });

           // Update empty file with blank content
           it('Update File With Blank Content', function() {

            var file = {uri:rootPath1+"FileUpdate.txt", contents: "       !!"};
            var retVal = cm.updateFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);


            var file = {uri:rootPath1 + "FileUpdate.txt"};
            var retVal = cm.deleteFile(file);


           });

        });

        // Open a file
        describe('File Open Tests', function() {


            it('Open File', function() {

            var file = {uri:rootPath1+"FileOpen.txt"};
            var ret = cm.createFile(file);

            var file = {uri:rootPath1+"FileOpen.txt"};
            var retVal = cm.readFile(file);

            expect(retVal.success).toEqual(true);

            expect(retVal.status).toEqual(200);
            console.log(retVal.content);

            var file = {uri:rootPath1 + "FileOpen.txt"};
            var retVal = cm.deleteFile(file);

            });

        });


        // Modify a File
        describe('File Modified Tests', function() {

            // var retVal = cm.createFile(file);
            it('File Modified Test', function() {
            var file = {uri:rootPath1 + "ModifyFile.txt", contents:"Hello World!" };
            var file2 = {uri:rootPath1 + "ModifyFile.txt", contents:"Hey World!" }
            var retVal = cm.createFile(file);
            var dir = {uri:rootPath1};
            var retValDir = cm.getDirectoryContents(dir);
            console.log(retValDir);
            var myJsonObject = eval('(' + retValDir.content + ')');
            console.log(myJsonObject);
            var retVal_update = cm.updateFile(file);
            console.log(retVal_update);
            var retVal = cm.isFileModified(file,myJsonObject.children[0].modifiedDate);

            console.log(retVal);
            expect(retVal.status).toEqual(200);

            });


        });


        // Modify a Directory 
        describe('Directory Modified Tests', function() {
                        
            it('Directory Modified Test - file creation', function() {
           // debugger;
            var file = {uri:rootPath1+ "Myfile1.txt"};
            var dir = {uri:rootPath1};
            console.log(dir);
            var retValDir = cm.getDirectoryContents(dir);
            console.log(retValDir);
            var myJsonObject = eval('(' + retValDir.content + ')');
            var retVal_update = cm.createFile(file);
            console.log(myJsonObject);
            var retVal = cm.isDirectoryModified(dir,myJsonObject.modifiedDate);

            console.log(retVal);
            expect(retVal.status).toEqual(200);
            });

        });
        
        

         // File is Writable or not
         describe('File Writable Test', function() {

             it('File Writable', function() {
                       // debugger;
                        var file = {uri:rootPath1+"NewFile.txt"};
                        var dir = {uri:rootPath1};
                        var retVal_update = cm.createFile(file);
                        //var retValDir = cm.getDirectoryContents(dir);
                        //console.log(retValDir);
                       // var myJsonObject = eval('(' + retValDir.content + ')');
                        //var retVal_update = cm.deleteDirectory(file);
                       // console.log(myJsonObject);
                        var retVal = cm.isFileWritable(file);

                        console.log(retVal);
                        expect(retVal.status).toEqual(204);
             });

        });
    

        // Create Directory 
        describe('Directory Create Tests', function() {

           it('Create Directory', function() {
            console.log("14");
            var dir = {uri:rootPath1+"DirCreated"};
            var retVal = cm.createDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(201);

           });


          it('Create Existing Directory', function() {
            console.log("15");
            var dir = {uri:rootPath1+"DirCreated"};


            var retVal = cm.createDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(400);

          });

          it('Add Files To The Directory', function() {
            console.log("16");
            var file= {uri:rootPath1+"DirCreated/DirectoryFile.txt"};

            var retVal = cm.createFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(201);

          });

          it('Delete Files From The Directory', function() {
           console.log("17");
            var file = {uri:rootPath1+"DirCreated/DirectoryFile.txt"};

            var retVal = cm.deleteFile(file);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

          });

          it('Create Directory Within A Directory', function() {
           console.log("18");
            var dir = {uri:rootPath1+"DirCreated/NestedFolder"};
            var retVal = cm.createDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(201);

            var dir = {uri:rootPath1+"DirCreated"};
            var retVal = cm.deleteDirectory(dir);

          });

        });


        // Delete Directory
        describe('Directory Delete Tests', function() {

          it('Delete Directory', function() {

           //Deleting a directory with contents is possible with this function

           var dir = {uri:rootPath1+"DirCreated"};
           var retVal = cm.createDirectory(dir);

           console.log("19");
            var dir = {uri:rootPath1+"DirCreated"};
            var retVal = cm.deleteDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

          });

        });


       // Check if Directory Exists 
       describe('Directory Exists Tests', function() {

          it('Directory Exists', function() {

            var dir = {uri:rootPath1+"DirExists"};
            var retVal = cm.createDirectory(dir);
            console.log("Called createDirectory which returned " + retVal);

            console.log("20");
            var dir = {uri:rootPath1+"DirExists"};

            var retVal = cm.directoryExists(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

          });

          it('Directory Does Not Exists', function() {
           console.log("21");

            var dir = {uri:rootPath1+"DirExists2"};

            var retVal = cm.directoryExists(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(404);

            var dir = {uri:rootPath1+"DirExists"};
            var retVal = cm.deleteDirectory(dir);

          });

        });
        

        // Get Directory Content
        describe('Get Directory Contents Tests', function() {

          it('Get Directory Contents of Non-Empty Directory', function() {

            var dir = {uri:rootPath1+"DirCreated"};
            var retVal = cm.createDirectory(dir);
            var dir = {uri:rootPath1+"DirCreated/NestedFolder"};
            var retVal = cm.createDirectory(dir);

            console.log("22");
            var dir = {uri:rootPath1+"DirCreated"};

            var retVal = cm.getDirectoryContents(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(200);
            console.log(retVal.content);

          });


          it('Get Contents of An Empty Directory', function() {
            console.log("23");

            var dir = {uri:rootPath1+"DirCreated/NestedFolder"};

            var retVal = cm.getDirectoryContents(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(200);
            console.log(retVal.content);

            var dir = {uri:rootPath1+"DirCreated"};
            var retVal = cm.deleteDirectory(dir);

          });

        });

         
         // Copy a Directory
         describe('Copy Directory Tests', function() {
         
          it('Copy Directory', function() {

            var dir = {uri:rootPath1+"DirCopy"};
            var retVal = cm.createDirectory(dir);

            console.log("24");

            var dir = {sourceUri:"/" + rootPath1+"DirCopy", destUri:rootPath2+"DirCopy" };

            var retVal = cm.copyDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);


          });


          it('Copy Directory To A Destination Directory Which Contains Another Directory With The Same Name', function() {
            console.log("25");
            var dir = {sourceUri:"/"+rootPath1+"DirCopy", destUri:rootPath2+"DirCopy" };

            var retVal = cm.copyDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(400);

          });

          it('Copy Directory To The Same Directory', function() {
            console.log("26");
            var dir = {sourceUri:"/"+rootPath1+"DirCopy", destUri:rootPath1+"DirCopy" };

            var retVal = cm.copyDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(400);

            var dir = {uri:rootPath1+"DirCopy"};
            var retVal = cm.deleteDirectory(dir);
            var dir = {uri:rootPath2+"DirCopy"};
            var retVal = cm.deleteDirectory(dir);

          });

        });

        
        // Move a Directory
        describe('Move Directory Tests', function() {

            it('Move Directory', function() {

            var dir = {uri:rootPath1+"DirMove"};
            var ret1 = cm.createDirectory(dir);

            console.log("27");

            var dir = {sourceUri:"/"+rootPath1+"DirMove", destUri:rootPath2+"DirMove"};

            var retVal = cm.moveDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(204);

           });

           it('Move Directory To The Same Directory', function() {
            console.log("28");
            var dir = {sourceUri:"/"+rootPath2+"DirMove", destUri:rootPath2+"DirMove" };
            var retVal = cm.moveDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(400);

           });

            it('Move Directory To A Destination Directory Which Contains Another Directory With The Same Name', function() {
            console.log("29");
            var dir = {sourceUri:"/"+rootPath2+"DirMove", destUri:rootPath2+"DirMove" };
            var retVal = cm.moveDirectory(dir);

            expect(retVal.success).toEqual(true);
            expect(retVal.status).toEqual(400);

            var dir = {uri:rootPath2+"DirMove"};
            var retVal = cm.deleteDirectory(dir);

            //Optional: Delete the main directories created at the beginning of this file so as to not delete them manually
            var dir = {uri:InitDirPath1 + "FileTest1"};
            var retVal = cm.deleteDirectory(dir);
            var dir = {uri:InitDirPath1 + "FileTest2"};
            var retVal = cm.deleteDirectory(dir);

           });

        });

   
});
});



















