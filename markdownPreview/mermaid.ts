import mermaid from 'mermaid';

function processMermaidErrorOuts(processCallback: (element: HTMLElement) => void) {
    for (const possibleMermaidErrorOut of document.getElementsByTagName('svg')) {
        const parent = possibleMermaidErrorOut.parentElement;
        if (parent?.classList.contains('mermaid')) {
            processCallback(parent);
        }
    }
}

export function renderMermaidBlocksInElement(root: HTMLElement) {

    // Delete existing mermaid outputs
    processMermaidErrorOuts((mermaidErrorOut) => {
        mermaidErrorOut.remove();
    });

    for (const mermaidContainer of root.getElementsByClassName('mermaid') ?? []) {
        renderMermaidElement(mermaidContainer);
    }

    function renderMermaidElement(mermaidContainer: Element) {
        const id = `mermaid-${crypto.randomUUID()}`;
        const source = mermaidContainer.textContent ?? '';

        const out = document.createElement('div');
        out.id = id;
        mermaidContainer.innerHTML = '';
        mermaidContainer.appendChild(out);

        try {
            mermaid.mermaidAPI.reset();
            mermaid.render(id, source, (out) => {
                mermaidContainer.innerHTML = out;
            });
        } catch (error) {
            if (error instanceof Error) {
                const errorMessageNode = document.createElement('pre');

                errorMessageNode.innerText = error.message;

                processMermaidErrorOuts((mermaidErrorOut) => {
                    mermaidErrorOut.appendChild(errorMessageNode);
                });
            }

            // don't break standard mermaid flow
            throw error;
        }
    }
}
