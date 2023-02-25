class NoteItem {
    constructor(props) {
        this.id = props.id;
        this.parentId = props.parentId;
        this.title = props.title === "" ? "无标题笔记" : props.title;
        this.contain = props.contain === "" ? "无内容" : props.contain;
        this.labels = props.labels === [] ? ["无标签"] : props.labels;
        this.kind = props.kind;
        this.createdDate = props.createdDate;
        this.likes = props.likes;
        this.comments = props.comments;
        this.creator = props.creator;
        this.readers = props.readers;
    }
}
