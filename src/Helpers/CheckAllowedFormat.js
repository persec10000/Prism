
function extname(path) {
  var tmp = path.replace(/^[\.]+/, '');
  if (/\./.test(tmp)) return tmp.match(/\.[^.]*$/)[0];
  return '';
}

const filetypes = ['pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4', 'bpm', 'mpeg', 'wmv'];

const CheckAllowedFormat = (filename) => {
	let ext = extname(filename);
	console.log("ext=====",ext);
	if (ext.length > 1) {
		ext = ext.substr(1);
		if (filetypes.findIndex((el) => el === ext.toLowerCase()) >= 0) return true;
	}
	return false;
};

export default CheckAllowedFormat;
