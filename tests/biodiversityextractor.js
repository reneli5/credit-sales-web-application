import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xslx = require('xlsx')
const processBiodiversityMetrics = (bioDiversityFile) => {
	
	const creditSalesDomain = {
		'headlineSummary': [],
		'habitatBaseline': []
	}
	
	const processHeadlineSummary = (workBook) => {
		workBook.SheetNames.filter(sheetName => sheetName == 'Headline Results')
			.flatMap(sheetName => xslx.utils.sheet_to_json(workBook.Sheets[sheetName]))
			.filter(element => Object.keys(element).length == 3)
			.map(element => {
				creditSalesDomain.headlineSummary.push({
					'title': element['__EMPTY_1'],
					'subTitle': element['__EMPTY_5'],
					'totalAMount': element['__EMPTY_7']
				});
			});
	}
	
	const addSubTitle = (element, extractionResults, content) => {
		let current = extractionResults[extractionResults.length - 1];
		if (current['subtitles'] == undefined) {
			current['subtitles'] = [content];
		} else {
			current.subtitles.push(content);
		}
	}
	
	const addExtractedRow = (element, extractionConfig, key, content) => {
		if (extractionConfig.requiredFields.includes(key) && element[extractionConfig.data[key]] !== undefined) {
			content[key] = element[extractionConfig.data[key]];
		}
	}
	
	const extractBiodiversityData = (workbook, extractionConfig) => {
		let extractionResults = [];
		xslx.utils.sheet_to_json(workBook.Sheets[extractionConfig.sheetName])
			.filter(element => 	element.__rowNum__ >= extractionConfig.startRowNumber)
			.map(element => {
				const content = {};
				Object.keys(extractionConfig.data).forEach(key => {
					addExtractedRow(element, extractionConfig, key, content);
				})
				
				if(Object.keys(content).length >=  extractionConfig.requiredFields.length) {
					extractionResults.push(content);
				}else if(Object.keys(content).length < extractionConfig.requiredFields.length && extractionConfig.hasSubTitles){
					addSubTitle(element, extractionResults, content);
				}
			})
		return extractionResults;
	}
	// const a1Headers = ['Habitat type', 'Area (hectares)', 'Condition']
	const workBook = xslx.readFile(bioDiversityFile);
	//
	// // processHeadlineSummary(workBook);
	const habitatBaselineConfig = {
		sheetName: 'A-1 Site Habitat Baseline',
		startRowNumber: 10,
		hasSubTitles: false,
		data: {
			habitatType: '__EMPTY_5',
			area: '__EMPTY_7',
			condition: '__EMPTY_10'
		},
		requiredFields: [
			'habitatType', 'area', 'condition'
		],
		includedColumns: [
			'Habitat type', 'Area (hectares)', 'Condition'
		]
	}
	
	const headlineSummaryConfig = {
		sheetName: 'Headline Results',
		startRowNumber: 7,
		hasSubTitles: true,
		data: {
			'title': '__EMPTY_1',
			'subTitle': '__EMPTY_5',
			'totalAMount': '__EMPTY_7'
		},
		requiredFields: [
			'title', 'subTitle', 'totalAMount'
		],
		includedColumns: [
			'On-site baseline',
			'On-site post-intervention\r\n(Including habitat retention, creation & enhancement)',
			'Off-site baseline',
			'Off-site post-intervention\r\n(Including habitat retention, creation & enhancement)',
			'Total net unit change\r\n(including all on-site & off-site habitat retention/creation)',
			'Total net % change\r\n(including all on-site & off-site habitat creation + retained habitats)'
		]
	}
	
	// creditSalesDomain.headlineSummary = extractBiodiversityData(workBook, headlineSummaryConfig);
	creditSalesDomain.habitatBaseline = extractBiodiversityData(workBook, habitatBaselineConfig);
	// console.log('******' + JSON.stringify(creditSalesDomain));
	// return creditSalesDomain;
}

processBiodiversityMetrics('biodiversity3.xlsm');
