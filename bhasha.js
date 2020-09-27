import Quill from "quill";
import Sanscript from "@sanskrit-coders/sanscript";

console.log("Loading", Sanscript.t("bh-as.-a", "iast_ascii", "devanagari"), "...");

var Delta = Quill.import('delta');

class Bhasha {
    constructor(quill, options) {
        this.quill = quill;
        this.options = options;

        this.enabled = true;

        let from = document.querySelector(this.options.fromDropdown);
        if (from) from.addEventListener('change', this.changeScheme);
        let to = document.querySelector(this.options.toDropdown);
        if (to) to.addEventListener('change', this.changeScheme);
        this.changeScheme(); //read current values

        quill.on("text-change", this.transliterate.bind(this));
    }

    changeScheme(){
        let from = document.querySelector(this.options.fromDropdown + " option:checked");
        
        if(from) 
            this.fromScheme = from.value;
        else 
            this.fromScheme = "iast_ascii"

        let to = document.querySelector(this.options.toDropdown + " option:checked");
        
        if(to) 
            this.toScheme = to.value;
        else 
            this.toScheme = "devanagari"

        console.log("From", this.fromScheme, "To", this.toScheme);
    }

    transliterate(delta, oldDelta, source){ 
        
        if(!this.enabled || source != 'user') return;

        const range = this.quill.getSelection();
        if (range == null) return;
    
        const currPos = range.index;
        const currWord = this.getCurrentWord(currPos);
        
        if(currWord){
            this.processWord(delta, currPos, currWord);
        }
    }
    
    processWord(delta, currPos, currWord){
    
        var pos = currPos-currWord.length;
        var delLength = currWord.length;

        var dIdx = 1;
        if (delta.ops.length == 2) dIdx = 1; //middle edit
        else if (delta.ops.length == 1) dIdx = 0; //new doc
        else return;
        
        if(delta.ops[dIdx].delete || delta.ops[dIdx].insert){
            //only when something is added or deleted
            if (delta.ops[dIdx].insert){
                if (!delta.ops[dIdx].insert.trim())
                    return

                const rev_t = Sanscript.t(currWord.substring(0, 
                                            currWord.length-delta.ops[dIdx].insert.length), 
                                    this.toScheme, this.fromScheme); //get reverse

                currWord = rev_t + delta.ops[dIdx].insert;
            }
            const t = Sanscript.t(currWord, this.fromScheme, this.toScheme);
            // console.log(currPos, "currWord", currWord,  "->", t, t.length);

            var edit = new Delta().retain(pos)
                                .delete(delLength)
                                .insert(t, this.quill.getFormat());

            // const e_delta = 
            this.quill.updateContents(edit, 'api');
            // console.log(e_delta);

            // Move cursor after edit
            // TODO: Fix this
            window.setTimeout(() => this.quill.setSelection(pos + t.length, 0), 0)
        }
    }
      
    getCurrentWord(currPos){
        const maxLookbehind = 50;
        var startPos = currPos - maxLookbehind;
        startPos = startPos > 0 ? startPos : 0;
        const currText = this.quill.getText(
            startPos,
            currPos - startPos
        )
        return currText.split(/(\s+)/).pop();
    }
}

export default Bhasha;