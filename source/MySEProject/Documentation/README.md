# Project Title: ML22/23-15 Approve Prediction of Multisequence Learning.

**Summary of Project:**
=======================================

Amid the early morning chorus of a bustling train station, I found myself mesmerized by the intricate dance of commuters, a living tapestry of movement and routine. Each arrival and departure, each hurried step and paused goodbye, played out like a complex sequence, echoing the vast network of thoughts and memories within the human neocortex. This moment of clarity, amidst the chaos, became the catalyst for my deep dive into the NeocortexAPI's multisequence learning project.

The project, a beacon of innovation within the C#/.NET Core landscape, aims to emulate the remarkable pattern recognition and learning capabilities of the human brain. Enthralled by the prospect of contributing to this frontier, I envisioned creating AI systems capable of deciphering and predicting the nuanced patterns of life, from the ebbs and flows of financial markets to the subtle intricacies of human language​​.

This venture wasn't merely a technical challenge; it was a journey towards pioneering an AI that mirrors the adaptability and insight of human cognition. It promised a future where technology could seamlessly anticipate and navigate the complexities of our world, making this endeavor not just a project, but a passion. To explore this fascinating intersection of technology and human-like learning, the NeocortexAPI GitHub repository offers a gateway to innovation.

1.Objective
-------------
Illustrate the process of learning sequences and forecasting the succeeding element in a given sequence and retrieve sequences from a file and create an output file after making predictions.

For instance, when reading sequences such as 8,9,11,78,5... from an .excel file, providing a sequence input like 8,9,11 should result in predicting the next element, which, in this case, is 78.

2.Approach
-------------
![1.png](./images/Architecture.jpg)

Fig.1 Schematic block diagram of the architecture

Implemented a new method RunPredictionMultiSequenceExperiment, that improves the existing RunMultiSequenceLearningExperiment. 
The new method should automatically read learning sequences from a file and learn them. After learning is completed,
the sample should read testing subsequences from another file and calculate the prediction accuracy.
Project's aim - To calculate the accuracy of matched sequences and write the accuracy into CSV file.

In Program.cs file team has implemented new methods as mentioned below:
1. [_RunPredictionMultiSequenceExperiment()_](https://github.com/pparaska/neocortexapi_Team_MSL/blob/a9e97732c57b37f16e0b7c31398981f198080d19/source/Samples/NeoCortexApiSample/Program.cs#L53C29-L53C65) - This method automatically reads the training sequences from a file and learning them. 
				

2. [_GetInputFromExcelFile()_](https://github.com/pparaska/neocortexapi_Team_MSL/blob/a9e97732c57b37f16e0b7c31398981f198080d19/source/Samples/NeoCortexApiSample/Program.cs#L92) - To avoid user intervention, we are taking input samples from external Excel file.
			
```csharp
        private static Dictionary<string, List<double>> GetInputFromExcelFile()
        {
            string filePath = Path.Combine(Environment.CurrentDirectory, "Input.xlsx");
            Dictionary<string, List<double>> sequences = new Dictionary<string, List<double>>();
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    int temp = 0;
                    while (reader.Read())
                    {
                        List<double> inputList = new List<double>();
                        bool rowHasData = false;
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            string digit = reader.GetValue(i)?.ToString();
                            if (string.IsNullOrWhiteSpace(digit))
                            {
                                // Skip over empty cells
                                continue;
                            }
                            if (double.TryParse(digit, out double number))
                            {
                                if (number >= MinVal && number <= MaxVal)
                                {
                                    inputList.Add(number);
                                }
                                rowHasData = true;
                            }
                        }
                        if (rowHasData)
                        {
                            Console.Write("Sequence " + temp + " : ");
                            Console.WriteLine(string.Join(" ", inputList));
                            temp++;
                            sequences.Add("Sequence: " + temp, inputList);
                        }
                    }
                }
            }

            return sequences;
        }

```
				 
3. [_GetSubSequencesInputFromExcelFile()_](https://github.com/pparaska/neocortexapi_Team_MSL/blob/a9e97732c57b37f16e0b7c31398981f198080d19/source/Samples/NeoCortexApiSample/Program.cs#L167) - This method has implemented to avoid user intervention for subSequnces/test data inputs.

3.Prediction and Accuracy calculation:
---------------------------------------

In Program.cs file for [_PredictNextElement()_](https://github.com/pparaska/neocortexapi_Team_MSL/blob/a9e97732c57b37f16e0b7c31398981f198080d19/source/Samples/NeoCortexApiSample/Program.cs#L201), method team has implemented below changes:
	
1. In the method argument instead of passing double[], we have changed it to List<double> elements and calling this _PredictNextElement()_ method inside of for loop of _RunPredictionMultiSequenceExperiment()_, method where we can pass multiple test sequences/subsequences, and for each subSequnces/test sequence, _PredictNextElement()_ method will execute.

2. In _PredictNextElement()_, method new function for accuracy calculation logic is introduces.

```csharp
 private static void PredictNextElement(Predictor predictor, List<double> list)
        {
            Debug.WriteLine("------------------------------");
            int countOfMatches = 0;
            int totalPredictions = 0;
            string predictedSequence = "";
            string predictedNextElement = "";
            string predictedNextElementsList = "";

            // Generate file name with current date and time
            string fileName = string.Format("Final Accuracy ({0:dd-MM-yyyy HH-mm-ss}).csv", DateTime.Now);
            string filePath = Path.Combine(Environment.CurrentDirectory, fileName);

            for (int i = 0; i < list.Count - 1; i++)
            {
                var item = list[i];
                var nextItem = list[i + 1];
                var res = predictor.Predict(item);

                if (res.Count > 0)
                {
                    foreach (var pred in res)
                    {
                        Debug.WriteLine($"{pred.PredictedInput} - {pred.Similarity}");
                    }

                    var tokens = res.First().PredictedInput.Split('_');
                    var tokens2 = res.First().PredictedInput.Split('-');
                    var tokens3 = res.Last().PredictedInput.Split('_');
                    predictedSequence = tokens[0];
                    predictedNextElement = tokens2.Last();
                    predictedNextElementsList = string.Join("-", tokens3.Skip(1));
                    Debug.WriteLine($"Predicted Sequence: {predictedSequence}, predicted next element {predictedNextElement}");

                    if (nextItem == double.Parse(predictedNextElement))
                    {
                        countOfMatches++;
                    }
                }
                else
                {
                    Debug.WriteLine("Nothing predicted :(");
                }

                totalPredictions++;

                // Accuracy logic added which is based on count of matches and total predictions.
                double accuracy = AccuracyCalculation(list, countOfMatches, totalPredictions, predictedSequence, predictedNextElement, predictedNextElementsList, filePath);
                Debug.WriteLine($"Final Accuracy for elements found in predictedNextElementsList = {accuracy}%");

            }

            Debug.WriteLine("------------------------------");
        }
```

3. Accuracy is getting calculated by increasing the matches (which is counter), this counter is getting incremented by comparing the next appearing value with the last predicted value. These matches are getting divided by total number of predictions. 
We are exporting this accuracy result in external csv file _Final Accuracy.csv_ for each run and result is getting appended at new line.

![2.png](./images/2.png)

Fig.2 Flow chart of Prediction and Accuracy Calculation steps

```csharp
private static double AccuracyCalculation(List<double> list, int countOfMatches, int totalPredictions, string predictedSequence, string predictedNextElement, string predictedNextElementsList, string filePath)
        {
            double accuracy = (double)countOfMatches / totalPredictions * 100;
            Debug.WriteLine(string.Format("The test data list: ({0}).", string.Join(", ", list)));

            // Append to file in each iteration
            if (predictedNextElementsList != "")
            {
                string line = $"Predicted Sequence Number is: {predictedSequence}, Predicted Sequence: {predictedNextElementsList}, Predicted Next Element: {predictedNextElement}, with Accuracy =: {accuracy}%";
                Debug.WriteLine(line);
                File.AppendAllText(filePath, line + Environment.NewLine);
            }
            else
            {
                string line = $"Nothing is predicted, Accuracy is: {accuracy}%";
                File.AppendAllText(filePath, line + Environment.NewLine);
            }
            return accuracy;
        }
```
	
4. In MultisequenceLearning.cs encoder setting is updated to the range of min-max value 0-99, for the same input validation has been introduced in Program.cs file.

```csharp
		if (reader.GetDouble(i) >= MinVal && reader.GetDouble(i) <= MaxVal)
                {
                 TestSubSequences.Add(reader.GetDouble(i));
                 }
```

4.How to run this project:
---------------------------------------
- To run this project team has created a separate Project_Execution_Steps.md file.
- Please follow the steps mentioned here to run the project - [Project_Execution_Steps.md](https://github.com/pparaska/neocortexapi_Team_MSL/blob/Team_MSL/source/MySEProject/Documentation/Project_Execution_Steps.md)
