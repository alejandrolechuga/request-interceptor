import React from 'react';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center text-2xl">
      {title} Page
    </div>
  );
};

export default Options;
