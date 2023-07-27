import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';


function Note(props) {
    var {view,note,tagRemover,noteRemover,checkUpdate,setTargetNote,updatePin,psy,noteArchive,imgAdd,tp,del,res,getEditNote} = props;
    var {id,title,text,list,checkList,tags,images,bgImage,bgColor,pinned} = note;

    const errToast = (msg) => toast.error(msg);
    const sucToast = (msg) => toast.success(msg);

    const delTag = (el) => {
        var tg = el.currentTarget.getAttribute("tg");
        var tarId = el.currentTarget.getAttribute("uid");
        tagRemover(tarId,tg);
    }

    const delNote = (el) => {
        var tarId = el.currentTarget.getAttribute("uid");
        noteRemover(tarId);
        sucToast(`Moved to trash`);
    }

    const archiveNote = (el)=>{
        var tarId = el.currentTarget.getAttribute("uid");
        noteArchive(tarId,!note.archived);
        note.archived && sucToast(`Note Archieved`);
        !note.archived && sucToast(`Note Un Archieved`);
    }

    const restore = (el)=>{
        var tarId = el.currentTarget.getAttribute("uid");
        res(tarId);
        sucToast("Note restored!!");
    }

    const deleteForever = (el)=>{
        var tarId = el.currentTarget.getAttribute("uid");
        toast((t) => (
            <span style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <a style={{color:'black'}}>Are you <b>sure!!!</b></a>
                <div style={{display:"flex",columnGap:"5px"}}>
                    <button style={{backgroundColor:"rgb(233, 85, 85)",borderStyle:"none"}} onClick={() => {del(tarId);toast.dismiss(t.id);}}>Yes</button>
                    <button style={{backgroundColor:"rgb(58, 181, 58)",borderStyle:"none"}} onClick={() => {toast.dismiss(t.id);}}>No</button>
                </div>
            </span>
          ),{position: "top-center"});
    }

    const handleCheck = (e) =>{
        if(tp=="trash"){
            errToast("restore to edit");
            e.preventDefault();
        }
        else{
            var tarId = e.currentTarget.getAttribute("uid");
            var ck = e.target.attributes["idx"].value;
            var cked = e.target.checked;
            checkUpdate(tarId,ck,cked);
        }
    }

    const handleEdit= (e)=>{
    //     getEditNote(e.currentTarget.getAttribute("uid"));
    }

    const showImg = (e)=>{
        var img = document.createElement("img");
        const [file] = e.target.files;
        var tarId = e.currentTarget.getAttribute("uid");
        var c="";
        if (file) {
            c=URL.createObjectURL(file);
            img.setAttribute("src",c);
            img.setAttribute("alt","image");
        }
        var target = document.querySelector(`div[uid='${e.target.attributes["uid"].value}']`);
        target = target.querySelector(".images");
        target.prepend(img);
        imgAdd(tarId,c);
        e.target.value=null;
    }

    const displayPalette = (e) =>{
        setTargetNote(e.target.attributes["uid"].value);
        var palette = document.getElementById("palette");
        if(document.getElementById("editLabels").style.display !== 'none'){
            document.getElementById("editLabels").style.display = 'none';
          }
        palette.style.position = "absolute";
        palette.style.top = `${e.pageY}px` ;
        palette.style.left = `${e.pageX}px` ;
        palette.style.display = 'flex';
        e.stopPropagation();
    }

    const showList = (e) => {
        setTargetNote(e.target.attributes["uid"].value);
        var palette = document.getElementById("editLabels");
        if(document.getElementById("palette").style.display !== 'none'){
            document.getElementById("palette").style.display = 'none';
          }
        var checks = palette.querySelectorAll(".editLabelsList>span");
        checks.forEach((child)=>{
            var ar = Array.from(child.children);
            ar.forEach((c,idx)=>{
                if(c.checked!=undefined && tags.includes(ar[idx+1].innerText)){
                    c.checked=true;
                }
                else if(c.checked!=undefined){
                    c.checked=false;
                }
            });
        });
        palette.style.position = "absolute";
        palette.style.top = `${e.pageY}px` ;
        (window.innerWidth-e.pageY<250)?(palette.style.left = `${window.innerWidth-250}px`):(palette.style.left = `${e.pageX}px`);
        palette.style.display = 'flex';
        e.stopPropagation();
    }

    const togglePin = (e) => {
        updatePin(e.target.attributes["uid"].value,!pinned);
        e.stopPropagation();
    }

    var style={};
    if(psy=="p"){
        style={color:"black",textDecoration:"none"}
    }
    else{
        style={background: "linear-gradient(to left top, transparent 44%, black 45%, black 55%, transparent 56%)",color:"#00000080"};
    }


  return (
    <div className={` note ${view==="grid"?"":"noteResize"}`} uid={id} onClick={handleEdit} >
        <span className="images">
        {
            images.map((img)=>{
               return <img key={img} src={img} alt={`image${img}`} />
            })
        }
        </span>
        <span className="noteContent" style={{backgroundImage:bgImage,backgroundColor:bgColor}}>
            {
            tp!="trash"&&<span className="notePin hider">
                            <i className={`fa-solid fa-thumbtack curs`} style={style} uid={id} onClick={togglePin}> </i>
                        </span>
            }
            <span className="noteTitle">
                {title}
            </span>
            <span className="noteText">
                {text!="" && text}
                {text=="" && <ul>{
                    list!=[] && list.map((item,idx)=>{
                        return (<div key={item+idx} className="noteCheckList">
                                    <input type="checkbox" name="checker" idx={idx} uid={id} checked={checkList[idx]} onChange={handleCheck} className="listChecker"/>
                                    <li>{item}</li>

                                </div>)
                    })}
                    </ul>
                    }
            </span>
            <span className="noteLabels" id="noteLabels" uid={id}>
                {
                    tags.map((tag)=>{
                        return (<span key={tag} className="noteLabel">
                                    <span>{tag}</span>
                                    {
                                        tp!="trash"&&<div id="labelDel" onClick={delTag} tg={tag} uid={id}>
                                                        <i className="fa-solid fa-xmark fa-xl curs"></i>
                                                    </div>
                                    }
                                </span>)
                    })
                    
                }
            </span>
            {tp!="trash"&&
                <span className="noteOptions hider ">
                    <i className="fa-solid fa-palette curs add" onClick={displayPalette} uid={id} ></i>
                    {/* <label className="custom-file-upload">
                        <input type="file" id="imgUpload" uid={id} />
                        <i className="fa-regular fa-image curs add" style={{display:"none"}}></i>
                    </label> */}
                    <i className="fa-solid fa-box-archive curs add" style={{color:`${note.archived==true?'#00000080':"#000000"}`}}  onClick={archiveNote} uid={id}></i>
                    <i className="fa-solid fa-trash curs add" onClick={delNote} uid={id}></i>
                    <i className="fa-solid fa-tags curs add" onClick={showList} uid={id}></i> 
                </span>
            }
            {
                tp=="trash"&&
                <span className="noteOptions hider ">
                <i className="fa-solid fa-trash-can-arrow-up curs add" onClick={restore} uid={id}></i>
                <i className="fa-solid fa-dumpster-fire curs add" onClick={deleteForever} uid={id}></i>
                </span>
            }
        </span>
    </div>
  )
}

export default Note;