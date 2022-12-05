import React from "react";
import axios from "axios";
import { APIBase } from "../tools/api";
import { Form, useLoaderData } from "react-router-dom";

import "./css/addpreset.css"

type Props = {
    onClickClose: () => void,
    username: string,
}

interface PresetAPI {
    _id: Object,
    alias: string,
    preset: string,
    username: string,
}
interface Preset {
    alias: string,
    preset: string,
}

const AddPresetModal = ( { onClickClose, username }: Props ) => {

    const [ presetAlias, setPresetAlias ] = React.useState<string>("");
    const [ presetFood, setPresetFood ] = React.useState<string>("");

    const [ presetList, setPresetList ] = React.useState<Preset[]>([]);

    React.useEffect( () => {
        const asyncFun = async () => {
            const { data } = await axios.get<Preset[]>(APIBase + "/preset" + "/getPresets" + "?username=" + username);
            setPresetList(data);
        };
        asyncFun().catch( (e) => window.alert(`Error fetching Preset List: ${ e }`) );
    })

    const onSubmitHandler = () => {
        const data = { alias: presetAlias, preset: presetFood, username: username };
        const asyncFun = async () => {
            await axios.post(APIBase + "/preset" + "/addPreset", data );
        }
        asyncFun().catch( (e) => window.alert(`Error adding to Preset List: ${ e }`));
        onClickClose();
    }
    const removePresetItem = (alias: string) => {
        const preset = presetList.find( (preset) => preset.alias === alias ) as Preset;
        const asyncFun = async () => {
            await axios.post(APIBase + "/preset" + "/deletePreset", {presetAlias: preset.alias, username: username} );
        }
        asyncFun().catch( (e) => window.alert(`Error deleting from Preset List: ${ e }`));
    }
    

    return (
        <>
            <div className={"input-field"}>
                <span>
                    Alias: <br/>
                    <input name={"alias"} className={"preset-alias"} type={"text"} onChange={ (event) => setPresetAlias(event.target.value) }/>
                </span>
                <span className={"preset-arrow"}> &gt;&gt; </span>
                <input name={"preset"} className={"preset-foodname"} type={"text"} onChange={ (event) => setPresetFood(event.target.value) }/>
            </div>
            <p className={"usage"}>Usage: "#alias" will automagically converted to the name.</p>
            <button className={"preset-buttons"} onClick={onSubmitHandler}>Apply</button>
            <button className={"preset-buttons"} onClick={onClickClose}>Close</button>
            <div className={"preset-list"}>Current Presets:</div>
            { presetList.map((presetItem) =>
                <div className={"preset"}><button className={"remove-button"} onClick={ () => removePresetItem(presetItem.alias) }>x</button>#{presetItem.alias} &gt;&gt; {presetItem.preset}</div>
            ) }
        </>
    )
}

export default AddPresetModal;