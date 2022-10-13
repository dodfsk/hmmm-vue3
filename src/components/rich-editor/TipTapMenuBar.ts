let editor:any

export const TipTapMenuBar=[
    {
        name:'bold',
        click:()=>editor.value?.chain().focus().toggleBold().run(),
        class:{ 'is-active': editor.value?.isActive('bold') },
        disabled:!editor.value?.can().chain().focus().toggleBold().run(),
    },
    {
        name:'italic',
        click:()=>editor.value?.chain().focus().toggleItalic().run(),
        class:{ 'is-active': editor.value?.isActive('italic') },
        disabled:!editor.value?.can().chain().focus().toggleItalic().run(),
    },
    {
        name:'strike',
        click:()=>editor.value?.chain().focus().toggleStrike().run(),
        class:{ 'is-active': editor.value?.isActive('strike') },
        disabled:!editor.value?.can().chain().focus().toggleStrike().run(),
    },
    {
        name:'code',
        click:()=>editor.value?.chain().focus().toggleCode().run(),
        class:{ 'is-active': editor.value?.isActive('code') },
        disabled:!editor.value?.can().chain().focus().toggleCode().run(),
    },
    {
        name:'clear marks',
        click:()=>editor.value?.chain().focus().unsetAllMarks().run(),
    },
    {
        name:'clear nodes',
        click:()=>editor.value?.chain().focus().clearNodes().run(),
    },
    {
        name:'paragraph',
        click:()=>editor.value?.chain().focus().setParagraph().run(),
        class:{ 'is-active': editor.value?.isActive('paragraph') },
        // disabled:!editor.value?.can().chain().focus().setParagraph().run(),
    },
    {
        name:'h1',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 1 }) },
        // disabled:!editor.value?.can().chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        name:'h2',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 2 }) },
        // disabled:!editor.value?.can().chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        name:'h3',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 3 }) },
        // disabled:!editor.value?.can().chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        name:'h4',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 4 }) },
        // disabled:!editor.value?.can().chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
        name:'h5',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 5 }) },
        // disabled:!editor.value?.can().chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
        name:'h6',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 6 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 6 }) },
        // disabled:!editor.value?.can().chain().focus().toggleHeading({ level: 6 }).run(),
    },
    {
        name:'bullet list',
        click:()=>editor.value?.chain().focus().toggleBulletList().run(),
        class:{ 'is-active': editor.value?.isActive('bulletList') },
        // disabled:!editor.value?.can().chain().focus().toggleBulletList().run(),
    },
    {
        name:'ordered list',
        click:()=>editor.value?.chain().focus().toggleOrderedList().run(),
        class:{ 'is-active': editor.value?.isActive('orderedList') },
        // disabled:!editor.value?.can().chain().focus().toggleOrderedList().run(),
    },
    {
        name:'code block',
        click:()=>editor.value?.chain().focus().toggleCodeBlock().run(),
        class:{ 'is-active': editor.value?.isActive('codeBlock') },
        // disabled:!editor.value?.can().chain().focus().toggleCodeBlock().run(),
    },
    {
        name:'blockquote',
        click:()=>editor.value?.chain().focus().toggleBlockquote().run(),
        class:{ 'is-active': editor.value?.isActive('blockquote') },
        // disabled:!editor.value?.can().chain().focus().toggleBlockquote().run(),
    },
    {
        name:'horizontal rule',
        click:()=>editor.value?.chain().focus().setHorizontalRule().run(),
        // class:{ 'is-active': editor.value?.isActive('horizontal rule') },
        // disabled:!editor.value?.can().chain().focus().setHorizontalRule().run(),
    },
    {
        name:'hard break',
        click:()=>editor.value?.chain().focus().setHardBreak().run(),
        // class:{ 'is-active': editor.value?.isActive('hard break') },
        // disabled:!editor.value?.can().chain().focus().setHardBreak().run(),
    },
    {
        name:'undo',
        click:()=>editor.value?.chain().focus().undo().run(),
        class:{ 'is-active': editor.value?.isActive('undo') },
        disabled:!editor.value?.can().chain().focus().undo().run(),
    },
    {
        name:'redo',
        click:()=>editor.value?.chain().focus().redo().run(),
        class:{ 'is-active': editor.value?.isActive('redo') },
        disabled:!editor.value?.can().chain().focus().redo().run(),
    },

]