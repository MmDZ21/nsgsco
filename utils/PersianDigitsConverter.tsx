"use client"
import { useEffect } from "react";

const PersianDigitsConverter = () => {
  useEffect(() => {
    const persianDigits: Record<string, string> = {
      0: "۰",
      1: "۱",
      2: "۲",
      3: "۳",
      4: "۴",
      5: "۵",
      6: "۶",
      7: "۷",
      8: "۸",
      9: "۹",
    };

    function traverse(el: Node) {
      if (el.nodeType === Node.TEXT_NODE) {
        const textNode = el as Text;
        const list = textNode.data.match(/[0-9]/g);
        if (list !== null && list.length !== 0) {
          for (let i = 0; i < list.length; i++) {
            textNode.data = textNode.data.replace(
              list[i],
              persianDigits[list[i]]
            );
          }
        }
      }
      for (let i = 0; i < el.childNodes.length; i++) {
        traverse(el.childNodes[i]);
      }
    }

    traverse(document.body);
  }, []);

  return null;
};

export default PersianDigitsConverter;
