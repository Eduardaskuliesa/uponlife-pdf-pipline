import type { Block } from "../types";

const loremParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
];

const imageUrls = [
  "https://picsum.photos/seed/gotenberg001/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg002/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg003/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg004/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg005/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg006/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg007/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg008/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg009/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg010/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg011/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg012/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg013/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg014/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg015/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg016/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg017/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg018/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg019/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg020/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg021/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg022/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg023/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg024/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg025/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg026/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg027/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg028/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg029/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg030/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg031/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg032/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg033/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg034/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg035/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg036/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg037/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg038/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg039/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg040/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg041/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg042/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg043/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg044/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg045/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg046/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg047/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg048/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg049/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg050/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg051/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg052/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg053/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg054/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg055/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg056/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg057/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg058/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg059/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg060/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg061/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg062/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg063/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg064/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg065/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg066/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg067/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg068/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg069/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg070/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg071/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg072/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg073/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg074/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg075/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg076/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg077/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg078/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg079/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg080/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg081/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg082/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg083/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg084/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg085/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg086/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg087/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg088/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg089/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg090/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg091/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg092/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg093/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg094/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg095/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg096/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg097/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg098/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg099/2000/1000.jpg",
  "https://picsum.photos/seed/gotenberg100/2000/1000.jpg",
];

export function generateLargeBookContent(pages: number): Block[] {
  const blocks: Block[] = [];
  let imageIndex = 0;

  for (let i = 1; i <= pages; i++) {
    const hasImage = i % 5 === 0;

    let content = `<h2>Chapter ${Math.ceil(i / 10)} - Section ${i}</h2>`;

    if (hasImage) {
      imageIndex += 1;
      const imageUrl = imageUrls[imageIndex % imageUrls.length];
      content += `
        <figure style="margin: 20pt 0; text-align: center;">
          <img src="${imageUrl}" style="max-width: 100%; height: auto;" alt="Figure ${i}" />
          <figcaption style="font-size: 9pt; font-style: italic; margin-top: 8pt;">Figure ${i}: Sample illustration for this chapter</figcaption>
        </figure>
      `;
    }

    const paragraphCount = hasImage ? 4 : 7;
    for (let j = 0; j < paragraphCount; j++) {
      content += `<p>${loremParagraphs[j % loremParagraphs.length]}</p>`;
    }

    blocks.push({ type: "text", content, pageBreak: true });
  }

  return blocks;
}
