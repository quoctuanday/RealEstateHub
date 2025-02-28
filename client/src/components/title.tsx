import React from 'react';

function TitleComponent({ title }: { title: string }) {
    return (
        <h1 className="roboto-bold text-[1.25rem] pb-[1.25rem] border-b pl-[3rem]">
            {title}
        </h1>
    );
}

export default TitleComponent;
