import React from 'react';
import {Image} from 'react-native';

import {Images} from '../themes';

const filetypes = {
    pdf: Images.pdf,
    ppt: Images.ppt,
    pptx: Images.ppt,
    jpg: Images.jpg,
    png: Images.jpg,
    tif: Images.tif,
    xls: Images.xls,
    xlsx: Images.xls,
    doc: Images.doc,
    docx: Images.doc,
    wmv: Images.wmv,
    mp3: Images.wmv,
    mp4: Images.wmv,
    avi: Images.wmv,
};

const defaultFiletype = filetypes.doc;

const getSource = (extention = '') => {
    const src = extention.replace('.', '').toLowerCase();
    if (src in filetypes) return filetypes[src];
    else return defaultFiletype;
};

const FiletypeIcon = (props) => {
    const source = getSource(props.extention);
    return (
        <Image
            source={source}
            {...props}
        />
    );
};

export default FiletypeIcon;
