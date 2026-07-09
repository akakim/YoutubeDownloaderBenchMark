



// 안되는 케이스 
     workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // FileSaver.saveAs(blob, `${videoTitle}_${generateExcelFile()}.xlsx`);
        saveAs(blob, `${videoTitle}_${generateExcelFile()}.xlsx`);
      }).catch(err => console.log('Error writing excel export', err))

//오류 내용 




// 정답
  const fileName = `${videoTitle}_${generateExcelFile()}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, fileName);